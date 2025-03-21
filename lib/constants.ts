// export const SENDER_NAME = process.env.SENDER_NAME || 'support'
// export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'

// export const USER_ROLES = ['Admin', 'User']
// export const COLORS = ['Gold', 'Green', 'Red']
// export const THEMES = ['Light', 'Dark', 'System']

export const APP_NAME=process.env.NEXT_PUBLIC_APP_NAME || 'NXT'
export const APP_SLOGAN=process.env.NEXT_PUBLIC_APP_SLOGAN || 'Spend less,enjoy more'
export const APP_DESCRIPTION= process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'shoe store app'

export const SERVER_URL=process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const SENDER_EMAIL=process.env.SENDER_EMAIL || 'ayushbochare123@gmail.com'
export const SENDER_NAME = process.env.SENDER_NAME || APP_NAME


export const PAGE_SIZE=Number(process.env.PAGE_SIZE || 9)

export const FREE_SHIPPING_MIN_PRICE = Number(process.env.FREE_SHIPPING_MIN_PRICE || 35);

export const APP_COPYRIGHT=
    process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
    "Copyright All rights reserved"


export const AVAILABLE_PAYMENT_METHOD=[
    {
        name:'PayPal',
        commission:0,
        isDefault:true,
    },
    {
        name:'Stripe',
        commission:0,
        isDefault:false,
    },
    {
        name:'Cash on Delivery',
        commission:0,
        isDefault:false,

    }
]

export const DEFAULT_PAYMENT_METHOD=process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'

export const AVAILABLE_DELIVERY_DATES=[
    {
        name:'Tomorrow',
        daysToDeliver:1,
        shippingPrice:13,
        freeShippingMinPrice:0,

    },
    {
        name:'Next 3 Days',
        daysToDeliver:3,
        shippingPrice:10,
        freeShippingMinPrice:0,
    },
    {
        name:'Next 5 Days',
        daysToDeliver:5,
        shippingPrice:5,
        freeShippingMinPrice:35,
    }
]



 
    
