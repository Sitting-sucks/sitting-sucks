import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface EquipmentCardProps {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  inStock?: boolean;
  externalLink?: string;
}

const EquipmentCard = ({
  name,
  description,
  price,
  category,
  image,
  inStock = true,
  externalLink
}: EquipmentCardProps) => {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isInCart = items.some(i => i.id === name);

  const handleAddToCart = () => {
    addItem({ id: name, name, price, image });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          {externalLink ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => window.open(externalLink, '_blank')}
            />
          ) : (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
      )}
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
            <span className="text-2xl font-bold text-primary">${price.toFixed(2)}</span>
            <p className="text-sm text-muted-foreground">
              {inStock ? "In Stock" : "Out of Stock"}
            </p>
          </div>
          {externalLink ? (
            <Button
              variant={inStock ? "default" : "secondary"}
              disabled={!inStock}
              className="flex items-center space-x-2"
              onClick={() => window.open(externalLink, '_blank')}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Buy on Amazon</span>
            </Button>
          ) : (
            <Button
              variant={justAdded || isInCart ? "secondary" : "default"}
              disabled={!inStock}
              className="flex items-center space-x-2"
              onClick={handleAddToCart}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Added!</span>
                </>
              ) : isInCart ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>In Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;
