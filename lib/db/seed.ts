
import dotenv from 'dotenv';
import data from '@/lib/data';
import { connectToDatabase } from '.';
import User from './models/user.model';
import Product from './models/product.model';
import Review from './models/review.model';


dotenv.config();


console.log('MONGODB_URI:', process.env.MONGODB_URI); 
if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}

const main = async () => {
    try {
        const { products, users, reviews } = data;

        await connectToDatabase(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        await User.deleteMany();
        console.log("Existing users deleted");

        await Product.deleteMany();
        console.log("Existing products deleted");

        await Review.deleteMany();
        console.log("Existing reviews deleted");

      
        const createdUsers = await User.insertMany(users);
        console.log("Users inserted");

        await Product.bulkWrite(
            products.map(product => ({
                updateOne: {
                    filter: { slug: product.slug },
                    update: { $set: product },
                    upsert: true,
                }
            }))
        );
        console.log("Products inserted or updated");

        const createdProducts = await Product.find();
        const rws = [];

        for (let i = 0; i < createdProducts.length; i++) {
            let count = 0;
            const { ratingDistribution } = createdProducts[i];

            for (let j = 0; j < ratingDistribution.length; j++) {
                const filteredReviews = reviews.filter((review: { rating: number }) => review.rating === j + 1);
                if (filteredReviews.length === 0) continue;

                for (let k = 0; k < ratingDistribution[j].count; k++) {
                    rws.push({
                        ...filteredReviews[count % filteredReviews.length],
                        isVerifiedPurchase: true,
                        product: createdProducts[i]._id,
                        user: createdUsers[count % createdUsers.length]._id,
                        updatedAt: new Date(),
                        createdAt: new Date(),
                    });

                    count++;
                }
            }
        }

        await Review.insertMany(rws);
        console.log("Reviews inserted");

        console.log("Seeded database successfully");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

main();
