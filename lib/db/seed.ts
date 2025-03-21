// /* eslint-disable @typescript-eslint/no-explicit-any */
// import data from '@/lib/data'
// import { connectToDatabase } from '.'
// import User from './models/user.model'
// import Product from './models/product.model'
// import Review from './models/review.model'
// import { cwd } from 'process'
// // import * as env from '@next/env';

// // import Order from './models/order.model'
// // import {
// //   calculateFutureDate,
// //   calculatePastDate,
// //   generateId,
// //   round2,
// // } from '../utils'
// // import WebPage from './models/web-page.model'
// // import Setting from './models/setting.model'
// // import { OrderItem, IOrderInput, ShippingAddress } from '@/types'


// import dotenv from 'dotenv';
// dotenv.config();


// console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debugging step

// if (!process.env.MONGODB_URI) {
//     throw new Error('MONGODB_URI is not defined in environment variables');
// }


// const main = async () => {
//     try {
//         const { products, users,reviews} = data;
//         if (!process.env.MONGODB_URI) {
//             throw new Error("MONGODB_URI is not defined in environment variables");
//         }

//         console.log("Products:", products);
//         console.log("Users:", users);
// // console.log("Reviews:", reviews);
       

//         await connectToDatabase(process.env.MONGODB_URI);
//         console.log("Connected to MongoDB");

//         await User.deleteMany();
//         console.log("Existing users deleted");

//         const createdUsers = await User.insertMany(users);
//         console.log("Users inserted");

                
//         const createdProducts = await Product.insertMany(products);
//         console.log("Products inserted");

//         await Product.deleteMany();
//         console.log("Existing products deleted");

//         await Review.deleteMany();
//         const rws = [];
        
//         for (let i = 0; i < createdProducts.length; i++) {
//           let count = 0;
//           const { ratingDistribution } = createdProducts[i];
        
//           for (let j = 0; j < ratingDistribution.length; j++) {
//             const filteredReviews = reviews.filter((review: { rating: number }) => review.rating === j + 1);
        
//             if (filteredReviews.length === 0) continue; // Skip if no reviews match this rating
        
//             for (let k = 0; k < ratingDistribution[j].count; k++) {
//               rws.push({
//                 ...filteredReviews[count % filteredReviews.length], // Safe index selection
//                 isVerifiedPurchase: true,
//                 product: createdProducts[i]._id,
//                 user: createdUsers[count % createdUsers.length]._id, // Safe user selection
//                 updatedAt: new Date(),
//                 createdAt: new Date(),
//               });
        
//               count++; // Increment count properly
//             }
//           }
//         }
        
//         const createdReviews = await Review.insertMany(rws);
        



//         console.log({
//             createdUsers,
//             createdProducts,
//             message: "Seeded database successfully",
//         });

//         process.exit(0);
//     } catch (err) {
//         console.error("Error seeding database:", err);
//         process.exit(1);
//     }
// };

// main();


/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
import path from 'path';
import data from '@/lib/data';
import { connectToDatabase } from '.';
import User from './models/user.model';
import Product from './models/product.model';
import Review from './models/review.model';


dotenv.config();


console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debugging step

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}

const main = async () => {
    try {
        const { products, users, reviews } = data;

        await connectToDatabase(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Delete old data before inserting new data
        await User.deleteMany();
        console.log("Existing users deleted");

        await Product.deleteMany();
        console.log("Existing products deleted");

        await Review.deleteMany();
        console.log("Existing reviews deleted");

        // Insert new data
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

        // Insert reviews
        const createdProducts = await Product.find(); // Get updated product IDs
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
