import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

import { db } from "@/server";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import Image from "next/image";
import { formatDistance, subDays } from "date-fns";
import { ReviewForm } from "./components";

export const ProductReviews = async ({ productID }: { productID: number }) => {
  const data = await db.query.reviews.findMany({
    with: { user: true },
    where: eq(reviews.productID, productID),
    orderBy: [desc(reviews.created)]
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {data.map((review, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  width={50}
                  height={50}
                  src={review.user.image!}
                  alt="user avatar"
                  className="rounded-full"
                />
                <div>
                  <span className="font-semibold">{review.user.name}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground ">{review.comment}</p>
              <p className="text-xs text-bold text-muted-foreground mt-2">
                {formatDistance(subDays(review.created!, 0), new Date())}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ReviewForm productID={productID} />
    </div>
  );
};
