import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import EquipmentCard from "@/components/EquipmentCard";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Package, Star, CheckCircle, Minus, Plus, Trash2, Gift } from "lucide-react";

import weightPlatesImg from "@/assets/equipment/weight-plates.jpg";
import foamRollerImg from "@/assets/equipment/foam-roller.jpg";
import lacrosseBallImg from "@/assets/equipment/lacrosse-ball.jpg";
import pvcPipeImg from "@/assets/equipment/pvc-pipe.jpg";

const EquipmentStore = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const equipmentItems = [
    {
      name: "Yellow Perform Better Band",
      description: "High-quality resistance band for strengthening and mobility work",
      price: 9.99,
      category: "Resistance",
      image: "/lovable-uploads/341515b9-64c7-49bd-ac77-1129071bed02.png",
      inStock: true
    },
    {
      name: "Purple Plastic Handle",
      description: "Ergonomic handle for resistance band exercises",
      price: 14.99,
      category: "Accessories",
      image: "/lovable-uploads/bc8597f3-16a0-407c-a423-cfd0f339b083.png",
      inStock: true
    },
    {
      name: "Heel Wedges (Pair)",
      description: "Adjustable heel wedges for proper positioning and stretching",
      price: 19.99,
      category: "Positioning",
      image: "/lovable-uploads/5b31325f-a9c5-4b98-95a8-fcdcfc3bd59c.png",
      inStock: true
    },
    {
      name: "Two 2.5 lbs Plates",
      description: "Professional weight plates for added resistance",
      price: 19.99,
      category: "Weights",
      image: weightPlatesImg,
      inStock: true
    },
    {
      name: "Forearm Spinner",
      description: "Rotational device for forearm and wrist strengthening",
      price: 15.00,
      category: "Strength",
      image: "/lovable-uploads/72822b45-61da-48c3-881d-cf3badab9ca9.png",
      inStock: true
    },
    {
      name: "Foam Roller",
      description: "36-inch high-density foam roller for myofascial release",
      price: 39.99,
      category: "Recovery",
      image: foamRollerImg,
      inStock: true
    },
    {
      name: "Lacrosse Ball",
      description: "Firm rubber ball for targeted trigger point release",
      price: 8.99,
      category: "Recovery",
      image: lacrosseBallImg,
      inStock: true
    },
    {
      name: "Yoga Blocks (Set of 2)",
      description: "EVA foam blocks for support and alignment",
      price: 24.99,
      category: "Support",
      image: "/lovable-uploads/265c2daf-70cc-4d76-8cbf-1cc0da212765.png",
      inStock: true
    },
    {
      name: "5' PVC Pipe",
      description: "Lightweight PVC pipe for mobility and stretching exercises",
      price: 9.99,
      category: "Mobility",
      image: pvcPipeImg,
      inStock: true
    }
  ];

  const premiumEquipment = [
    {
      name: "Gray Cook Band",
      description: "Professional functional movement training system with handles and straps",
      price: 65.00,
      category: "Functional Training",
      image: "/lovable-uploads/3c5ceafa-c961-4870-85db-42608268c79d.png",
      inStock: true
    },
    {
      name: "Roman Chair",
      description: "Professional hyperextension bench for core and lower back strengthening",
      price: 149.99,
      category: "Strength Training",
      image: "/lovable-uploads/e47971dd-fbd4-4cb9-bb97-b1dc4a3ebafc.png",
      inStock: true,
      externalLink: "https://amzn.to/45DK2Cz"
    },
    {
      name: "Hypervolt Massage Gun",
      description: "Professional percussion massage device for muscle recovery and pain relief",
      price: 220.00,
      category: "Recovery",
      image: "/lovable-uploads/640c8213-90dd-49d3-8120-4b328af9a99b.png",
      inStock: true,
      externalLink: "https://amzn.to/4oyO5Zr"
    }
  ];

  const handleAddStarterKit = () => {
    // Add as a single bundle item
    addItem({
      id: 'starter-kit',
      name: 'Complete Starter Kit + 1 Month Free',
      price: 150,
      image: "/lovable-uploads/341515b9-64c7-49bd-ac77-1129071bed02.png",
    });
    setCartOpen(true);
  };

  const handleCheckout = () => {
    // Redirect to Stripe checkout
    // TODO: Replace with actual Stripe checkout URL or API call
    window.open('STRIPE_STORE_CHECKOUT_URL', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Cart Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Equipment Store</h1>
            <p className="text-xl text-muted-foreground">
              Get everything you need for your anti-sitting protocols
            </p>
          </div>
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Cart ({totalItems} items)</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col h-full">
                {items.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">Your cart is empty</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 space-y-4 overflow-y-auto pb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex items-center justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <Button className="w-full" size="lg" onClick={handleCheckout}>
                        Checkout — ${totalPrice.toFixed(2)}
                      </Button>
                      <Button variant="ghost" className="w-full" size="sm" onClick={clearCart}>
                        Clear Cart
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Starter Kit Highlight */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span>Complete Starter Kit</span>
                  <Badge variant="secondary">BEST VALUE</Badge>
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Everything you need to start your anti-sitting journey — plus a free month of app access
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">$150</div>
                <div className="flex items-center gap-1 text-sm text-success font-medium justify-end">
                  <Gift className="h-4 w-4" />
                  Includes 1 free month
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Includes all 9 essential items:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {equipmentItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-card p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Why choose the starter kit?</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Save vs. buying individually</li>
                    <li>• 1 free month of full app access included</li>
                    <li>• Free shipping on complete kit</li>
                    <li>• Everything arrives together, ready to go</li>
                  </ul>
                </div>
                <Button size="lg" className="w-full" onClick={handleAddStarterKit}>
                  <Package className="h-5 w-5 mr-2" />
                  Add Starter Kit to Cart — $150
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Equipment */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Premium Equipment</h2>
          <p className="text-muted-foreground mb-6">Advanced training tools for enhanced functionality</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumEquipment.map((item, index) => (
              <EquipmentCard
                key={index}
                name={item.name}
                description={item.description}
                price={item.price}
                category={item.category}
                image={item.image}
                inStock={item.inStock}
                externalLink={item.externalLink}
              />
            ))}
          </div>
        </div>

        {/* Individual Equipment */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Individual Equipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentItems.map((item, index) => (
              <EquipmentCard
                key={index}
                name={item.name}
                description={item.description}
                price={item.price}
                category={item.category}
                image={item.image}
                inStock={item.inStock}
              />
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle>Why Our Equipment?</CardTitle>
            <CardDescription>Carefully selected for maximum effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Quality Tested</h3>
                <p className="text-sm text-muted-foreground">
                  Every piece of equipment is tested for durability and effectiveness in our protocols.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Expert Curated</h3>
                <p className="text-sm text-muted-foreground">
                  Selected by movement professionals specifically for anti-sitting protocols.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Quick delivery so you can start your anti-sitting journey immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentStore;
