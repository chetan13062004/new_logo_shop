import { CartSchema, OrderInputSchema, OrderItemSchema, ProductInputSchema, ReviewInputSchema, ShippingAddressSchema, UserInputSchema, UserNameSchema, UserSignInSchema, UserSignUpSchema } from "@/lib/validator";

import {z} from "zod"



export type IReviewInput = z.infer<typeof ReviewInputSchema>
export type IReviewDetails = IReviewInput & {
  _id: string
  createdAt: string
  user: {
    name: string
  }
}

export type IProductInput=z.infer<typeof ProductInputSchema>



export type Data = {
    // settings: ISettingInput[]
    // webPages: IWebPageInput[]
    users: IUserInput[]
    products: IProductInput[]
    reviews: {
      title: string
      rating: number
      comment: string
    }[]
    headerMenus: {
      name: string
      href: string
    }[]
    carousels: {
      image: string
      url: string
      title: string
      buttonCaption: string
      isPublished: boolean
    }[]
  }

export type IOrderInput = z.infer<typeof OrderInputSchema>
export type IOrderList = IOrderInput & {
  _id: string
  user: {
    name: string
    email: string
  }
  createdAt: Date
}


// Add this to your types file
export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  // Add any other fields your addresses have
}


export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>

export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IUserName = z.infer<typeof UserNameSchema>
