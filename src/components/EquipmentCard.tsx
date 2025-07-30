import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface EquipmentCardProps {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  inStock?: boolean;
}

const EquipmentCard = ({ 
  name, 
  description, 
  price, 
  category, 
  image, 
  inStock = true 
}: EquipmentCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          <Badge variant="secondary">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-primary">${price}</span>
            <p className="text-sm text-muted-foreground">
              {inStock ? "In Stock" : "Out of Stock"}
            </p>
          </div>
          <Button 
            variant={inStock ? "default" : "secondary"} 
            disabled={!inStock}
            className="flex items-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;