import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMyClients } from "@/hooks/useMyClients";
import { Users, UserPlus, Loader2, UserCircle, ClipboardList, CalendarPlus, Search } from "lucide-react";

interface AddableClient {
  id: string;
  full_name: string | null;
  email: string;
}

const MyClients = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { clients, loading, refetch } = useMyClients();

  const [addable, setAddable] = useState<AddableClient[]>([]);
  const [addableLoading, setAddableLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviting, setInviting] = useState(false);

  const fetchAddable = useCallback(async () => {
    setAddableLoading(true);
    try {
      // Signed-up clients not yet on any trainer's roster
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "client")
        .is("trainer_id", null);
      if (error) throw error;

      const ids = (profiles || []).map((p) => p.id);
      const emails: Record<string, string> = {};
      if (ids.length > 0) {
        const { data: subs } = await supabase
          .from("subscribers")
          .select("user_id, email")
          .in("user_id", ids);
        (subs || []).forEach((s) => {
          if (s.user_id) emails[s.user_id] = s.email;
        });
      }
      setAddable((profiles || []).map((p) => ({ id: p.id, full_name: p.full_name, email: emails[p.id] || "" })));
    } catch (err) {
      console.error(err);
    } finally {
      setAddableLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddable();
  }, [fetchAddable]);

  const handleClaim = async (clientId: string) => {
    setBusyId(clientId);
    try {
      const { error } = await supabase.rpc("claim_client", { p_client_id: clientId });
      if (error) throw error;
      toast({ title: "Client added", description: "They're on your roster now." });
      await Promise.all([refetch(), fetchAddable()]);
    } catch (err) {
      toast({ title: "Couldn't add client", description: "Please try again.", variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const handleRelease = async (clientId: string) => {
    setBusyId(clientId);
    try {
      const { error } = await supabase.rpc("release_client", { p_client_id: clientId });
      if (error) throw error;
      toast({ title: "Client removed", description: "Removed from your roster." });
      await Promise.all([refetch(), fetchAddable()]);
    } catch (err) {
      toast({ title: "Couldn't remove client", description: "Please try again.", variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({ title: "Enter an email", variant: "destructive" });
      return;
    }
    setInviting(true);
    try {
      const { data, error } = await supabase.functions.invoke("invite-client", {
        body: { email: inviteEmail.trim(), full_name: inviteName.trim() || null },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error?: string }).error);
      toast({ title: "Invite sent", description: `${inviteEmail} will get an email to finish signing up.` });
      setInviteEmail("");
      setInviteName("");
      await Promise.all([refetch(), fetchAddable()]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Couldn't send invite", description: msg, variant: "destructive" });
    } finally {
      setInviting(false);
    }
  };

  const filteredAddable = addable.filter((c) => {
    const q = search.toLowerCase();
    return (c.full_name?.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            My Clients
          </h1>
          <p className="text-muted-foreground mt-1">
            Your roster — add people, log their sessions, and prescribe their work.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add a client</DialogTitle>
              <DialogDescription>
                Create a brand-new client, or add someone who already signed up.
              </DialogDescription>
            </DialogHeader>

            {/* Create a new client by email */}
            <div className="space-y-2 rounded-lg border p-3 mb-4">
              <div className="text-sm font-medium">Create a new client by email</div>
              <p className="text-xs text-muted-foreground">
                We'll create their account and email them a link to set their password.
              </p>
              <Input
                type="email"
                placeholder="client@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Input
                placeholder="Full name (optional)"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
              <Button className="w-full" disabled={inviting} onClick={handleInvite}>
                {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create & Send Invite"}
              </Button>
            </div>

            <div className="text-xs font-medium text-muted-foreground mb-2">
              Or add someone who already signed up
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {addableLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : filteredAddable.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No unassigned clients found.</p>
              ) : (
                filteredAddable.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 p-3 border rounded-lg">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{c.full_name || "Unnamed User"}</div>
                      <div className="text-xs text-muted-foreground truncate">{c.email || "No email on file"}</div>
                    </div>
                    <Button size="sm" disabled={busyId === c.id} onClick={() => handleClaim(c.id)}>
                      {busyId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <UserCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No clients on your roster yet. Use "Add Client" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <UserCircle className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">{c.full_name || "Unnamed User"}</div>
                    <div className="text-sm text-muted-foreground">{c.email || "No email on file"}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/admin/session-recap?client=${c.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ClipboardList className="h-4 w-4" /> Log Session
                    </Button>
                  </Link>
                  <Link to={`/admin/prescribe?client=${c.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <CalendarPlus className="h-4 w-4" /> Prescribe
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={busyId === c.id}
                    onClick={() => handleRelease(c.id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClients;
