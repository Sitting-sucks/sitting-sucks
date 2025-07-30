import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EquipmentCard from "@/components/EquipmentCard";
import { ShoppingCart, Package, Star, CheckCircle } from "lucide-react";

const EquipmentStore = () => {
  const [cartItems, setCartItems] = useState<string[]>([]);

  // Equipment data based on your specifications
  const equipmentItems = [
    {
      name: "Yellow Perform Better Band",
      description: "High-quality resistance band for strengthening and mobility work",
      price: 24.99,
      category: "Resistance",
      inStock: true
    },
    {
      name: "Purple Plastic Handle", 
      description: "Ergonomic handle for resistance band exercises",
      price: 12.99,
      category: "Accessories",
      inStock: true
    },
    {
      name: "Heel Wedges (Pair)",
      description: "Adjustable heel wedges for proper positioning and stretching",
      price: 19.99,
      category: "Positioning",
      inStock: true
    },
    {
      name: "Two 2.5 lbs Plates",
      description: "Compact weight plates for added resistance",
      price: 29.99,
      category: "Weights",
      inStock: true
    },
    {
      name: "Forearm Spinner",
      description: "Rotational device for forearm and wrist strengthening",
      price: 34.99,
      category: "Strength",
      inStock: true
    },
    {
      name: "Foam Roller",
      description: "36-inch high-density foam roller for myofascial release",
      price: 39.99,
      category: "Recovery",
      inStock: true
    },
    {
      name: "Yoga Blocks (Set of 2)",
      description: "EVA foam blocks for support and alignment",
      price: 22.99,
      category: "Support",
      inStock: true
    },
    {
      name: "Lacrosse Ball",
      description: "Firm rubber ball for targeted trigger point release",
      price: 8.99,
      category: "Recovery",
      inStock: true
    },
    {
      name: "3-4' PVC Pipe",
      description: "Lightweight PVC pipe for mobility and stretching exercises",
      price: 15.99,
      category: "Mobility",
      inStock: true
    },
    {
      name: "12-36\" Adjustable Box/Chair",
      description: "Height-adjustable platform for step-ups and positioning",
      price: 89.99,
      category: "Equipment",
      inStock: true
    }
  ];

  // Calculate starter kit price (with discount)
  const starterKitPrice = equipmentItems.reduce((total, item) => total + item.price, 0);
  const starterKitDiscount = starterKitPrice * 0.15; // 15% discount
  const starterKitFinalPrice = starterKitPrice - starterKitDiscount;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Equipment Store</h1>
          <p className="text-xl text-muted-foreground">
            Get everything you need for your anti-sitting protocols
          </p>
        </div>

        {/* Starter Kit Highlight */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span>Complete Starter Kit</span>
                  <Badge variant="secondary">BEST VALUE</Badge>
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Everything you need to start your anti-sitting journey
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground line-through">
                  ${starterKitPrice.toFixed(2)}
                </div>
                <div className="text-3xl font-bold text-primary">
                  ${starterKitFinalPrice.toFixed(2)}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Save ${starterKitDiscount.toFixed(2)} (15% off)
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Includes all 10 essential items:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {equipmentItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-card p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Why choose the starter kit?</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 15% discount vs. individual purchases</li>
                    <li>• Free shipping on complete kit</li>
                    <li>• Everything arrives together</li>
                    <li>• Curated for optimal results</li>
                  </ul>
                </div>
                <Button size="lg" className="w-full">
                  <Package className="h-5 w-5 mr-2" />
                  Add Starter Kit to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
                inStock={item.inStock}
              />
            ))}
          </div>
        </div>

        {/* Equipment Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Resistance", "Recovery", "Mobility", "Support", "Weights", "Accessories"].map((category) => (
              <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">
                    {category === "Resistance" && "🔥"}
                    {category === "Recovery" && "💆"}
                    {category === "Mobility" && "🤸"}
                    {category === "Support" && "🧘"}
                    {category === "Weights" && "🏋️"}
                    {category === "Accessories" && "🛠️"}
                  </div>
                  <h3 className="font-semibold">{category}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {equipmentItems.filter(item => item.category === category).length} items
                  </p>
                </CardContent>
              </Card>
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