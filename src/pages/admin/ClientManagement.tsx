import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePrograms, useClientPrograms } from "@/hooks/usePrograms";
import { Search, Users, Loader2, UserCircle, Calendar, Award, Eye } from "lucide-react";

interface Client {
  id: string;
  full_name: string | null;
  email: string;
  subscription_tier: string | null;
  subscribed: boolean;
  created_at: string;
}

interface ClientWithPrograms extends Client {
  assigned_programs: {
    id: string;
    program_name: string;
    status: string;
    assigned_at: string;
  }[];
}

const ClientManagement = () => {
  const { toast } = useToast();
  const { programs } = usePrograms();
  const { assignProgramToClient, unassignProgram } = useClientPrograms();

  const [clients, setClients] = useState<ClientWithPrograms[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedClient, setSelectedClient] = useState<ClientWithPrograms | null>(null);
  const [assigningProgram, setAssigningProgram] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all client profiles with their subscription data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, created_at')
        .eq('role', 'client');

      if (profilesError) throw profilesError;

      // Fetch subscription data
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('subscribers')
        .select('user_id, email, subscription_tier, subscribed');

      if (subscribersError) throw subscribersError;

      // Fetch client programs
      const { data: clientProgramsData, error: clientProgramsError } = await supabase
        .from('client_programs')
        .select(`
          id,
          client_id,
          status,
          assigned_at,
          programs (name)
        `);

      if (clientProgramsError) throw clientProgramsError;

      // Combine data
      const clientsWithData: ClientWithPrograms[] = (profilesData || []).map((profile) => {
        const subscription = subscribersData?.find((s) => s.user_id === profile.id);
        const programs = (clientProgramsData || [])
          .filter((cp) => cp.client_id === profile.id)
          .map((cp) => ({
            id: cp.id,
            program_name: (cp.programs as any)?.name || 'Unknown',
            status: cp.status,
            assigned_at: cp.assigned_at,
          }));

        return {
          id: profile.id,
          full_name: profile.full_name,
          email: subscription?.email || 'No email',
          subscription_tier: subscription?.subscription_tier || null,
          subscribed: subscription?.subscribed || false,
          created_at: profile.created_at,
          assigned_programs: programs,
        };
      });

      setClients(clientsWithData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleAssignProgram = async () => {
    if (!selectedClient || !assigningProgram) return;

    try {
      setIsAssigning(true);
      await assignProgramToClient(selectedClient.id, assigningProgram);
      toast({
        title: "Program assigned",
        description: "The program has been assigned to the client.",
      });
      await fetchClients();
      setAssigningProgram("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign program. The client may already have this program.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignProgram = async (assignmentId: string) => {
    try {
      await unassignProgram(assignmentId);
      toast({
        title: "Program removed",
        description: "The program has been removed from the client.",
      });
      await fetchClients();
      // Update selected client if viewing
      if (selectedClient) {
        const updatedClient = clients.find(c => c.id === selectedClient.id);
        if (updatedClient) {
          setSelectedClient({
            ...updatedClient,
            assigned_programs: updatedClient.assigned_programs.filter(p => p.id !== assignmentId)
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove program.",
        variant: "destructive",
      });
    }
  };

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier =
      selectedTier === "all" ||
      (selectedTier === "none" && !client.subscription_tier) ||
      client.subscription_tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getTierBadge = (tier: string | null) => {
    if (!tier) return <Badge variant="outline">No Subscription</Badge>;
    if (tier === "basic") return <Badge variant="secondary">Tier 1 ($30)</Badge>;
    if (tier === "coaching") return <Badge variant="default">Tier 2 ($200)</Badge>;
    return <Badge variant="outline">{tier}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Client Management
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your clients and their program assignments
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="none">No Subscription</SelectItem>
                <SelectItem value="basic">Tier 1 ($30)</SelectItem>
                <SelectItem value="coaching">Tier 2 ($200)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.length}</div>
            <div className="text-sm text-muted-foreground">Total Clients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {clients.filter((c) => c.subscribed).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Subscribers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {clients.filter((c) => c.subscription_tier === "basic").length}
            </div>
            <div className="text-sm text-muted-foreground">Tier 1 Clients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {clients.filter((c) => c.subscription_tier === "coaching").length}
            </div>
            <div className="text-sm text-muted-foreground">Tier 2 Clients</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Client List */}
      {!loading && (
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm || selectedTier !== "all"
                    ? "No clients match your filters"
                    : "No clients yet. Clients will appear here when they sign up."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded-full">
                        <UserCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">
                            {client.full_name || "Unnamed User"}
                          </h3>
                          {getTierBadge(client.subscription_tier)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{client.email}</p>
                        <div className="flex flex-wrap gap-2">
                          {client.assigned_programs.length > 0 ? (
                            client.assigned_programs.map((program) => (
                              <Badge key={program.id} variant="outline" className="gap-1">
                                <Calendar className="h-3 w-3" />
                                {program.program_name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">No programs assigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedClient(client)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {selectedClient?.full_name || "Client Details"}
                            </DialogTitle>
                            <DialogDescription>
                              {selectedClient?.email}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedClient && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardContent className="pt-4">
                                    <div className="text-sm text-muted-foreground">Subscription</div>
                                    <div className="mt-1">{getTierBadge(selectedClient.subscription_tier)}</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-4">
                                    <div className="text-sm text-muted-foreground">Member Since</div>
                                    <div className="font-medium">
                                      {new Date(selectedClient.created_at).toLocaleDateString()}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3">Assigned Programs</h4>
                                {selectedClient.assigned_programs.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No programs assigned</p>
                                ) : (
                                  <div className="space-y-2">
                                    {selectedClient.assigned_programs.map((program) => (
                                      <Card key={program.id}>
                                        <CardContent className="p-3 flex items-center justify-between">
                                          <div>
                                            <div className="font-medium">{program.program_name}</div>
                                            <div className="text-xs text-muted-foreground">
                                              Assigned {new Date(program.assigned_at).toLocaleDateString()}
                                            </div>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleUnassignProgram(program.id)}
                                            className="text-destructive hover:text-destructive"
                                          >
                                            Remove
                                          </Button>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {selectedClient.subscription_tier === "coaching" && (
                                <div>
                                  <h4 className="font-semibold mb-3">Assign New Program</h4>
                                  <div className="flex gap-2">
                                    <Select value={assigningProgram} onValueChange={setAssigningProgram}>
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select a program" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {programs
                                          .filter(
                                            (p) =>
                                              !selectedClient.assigned_programs.some(
                                                (ap) => ap.program_name === p.name
                                              )
                                          )
                                          .map((program) => (
                                            <SelectItem key={program.id} value={program.id}>
                                              {program.name}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      onClick={handleAssignProgram}
                                      disabled={!assigningProgram || isAssigning}
                                    >
                                      {isAssigning ? "Assigning..." : "Assign"}
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {selectedClient.subscription_tier !== "coaching" && (
                                <div className="p-4 bg-muted rounded-lg">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Award className="h-4 w-4" />
                                    Custom program assignment is available for Tier 2 clients only
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
