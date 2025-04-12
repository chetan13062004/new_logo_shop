'use server'

import { auth } from '@/auth'
import { connectToDatabase } from '../db'
import Address from '../db/models/address.model'
import { formatError } from '../utils'
import { revalidatePath } from 'next/cache'

export interface AddressData {
  _id?: string
  fullName: string
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
  email: string
  isDefault?: boolean
}

export async function createAddress(addressData: AddressData) {
  try {
    await connectToDatabase()
    const session = await auth()
    
    if (!session?.user?.id) {
      throw new Error('You must be logged in to create an address')
    }

    // If this is the first address or marked as default, set all other addresses to non-default
    if (addressData.isDefault) {
      await Address.updateMany(
        { user: session.user.id },
        { isDefault: false }
      )
    }

    // Check if this is the first address for the user
    const addressCount = await Address.countDocuments({ user: session.user.id })
    const isFirstAddress = addressCount === 0

    const address = await Address.create({
      ...addressData,
      user: session.user.id,
      isDefault: addressData.isDefault || isFirstAddress, // First address is default by default
    })

    revalidatePath('/account/addresses')
    revalidatePath('/checkout')

    return {
      success: true,
      message: 'Address created successfully',
      data: JSON.parse(JSON.stringify(address)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function updateAddress(addressData: AddressData) {
  try {
    await connectToDatabase()
    const session = await auth()
    
    if (!session?.user?.id) {
      throw new Error('You must be logged in to update an address')
    }

    const address = await Address.findOne({
      _id: addressData._id,
      user: session.user.id,
    })

    if (!address) {
      throw new Error('Address not found')
    }

    // If setting as default, unset all other addresses
    if (addressData.isDefault) {
      await Address.updateMany(
        { user: session.user.id, _id: { $ne: addressData._id } },
        { isDefault: false }
      )
    }

    Object.assign(address, addressData)
    await address.save()

    revalidatePath('/account/addresses')
    revalidatePath('/checkout')

    return {
      success: true,
      message: 'Address updated successfully',
      data: JSON.parse(JSON.stringify(address)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function deleteAddress(addressId: string) {
  try {
    await connectToDatabase()
    const session = await auth()
    
    if (!session?.user?.id) {
      throw new Error('You must be logged in to delete an address')
    }

    const address = await Address.findOne({
      _id: addressId,
      user: session.user.id,
    })

    if (!address) {
      throw new Error('Address not found')
    }

    const wasDefault = address.isDefault

    await address.deleteOne()

    // If the deleted address was the default, set another address as default
    if (wasDefault) {
      const anotherAddress = await Address.findOne({ user: session.user.id })
      if (anotherAddress) {
        anotherAddress.isDefault = true
        await anotherAddress.save()
      }
    }

    revalidatePath('/account/addresses')
    revalidatePath('/checkout')

    return {
      success: true,
      message: 'Address deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function getAddresses() {
  try {
    await connectToDatabase()
    const session = await auth()
    
    if (!session?.user?.id) {
      throw new Error('You must be logged in to view addresses')
    }

    const addresses = await Address.find({ user: session.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    })

    return {
      success: true,
      data: JSON.parse(JSON.stringify(addresses)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function getDefaultAddress() {
  try {
    await connectToDatabase()
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: true, data: null }
    }

    const address = await Address.findOne({
      user: session.user.id,
      isDefault: true,
    })

    return {
      success: true,
      data: address ? JSON.parse(JSON.stringify(address)) : null,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// ... existing code ...

// Improved implementation of getAddressById
export async function getAddressById(id: string) {
    try {
      await connectToDatabase()
      const session = await auth()
      
      if (!session?.user?.id) {
        throw new Error('You must be logged in to view this address')
      }
  
      const address = await Address.findOne({
        _id: id,
        user: session.user.id,
      })
  
      if (!address) {
        return {
          success: false,
          message: 'Address not found'
        }
      }
  
      return {
        success: true,
        data: JSON.parse(JSON.stringify(address)),
        message: 'Address retrieved successfully'
      }
    } catch (error) {
      return { 
        success: false, 
        message: formatError(error) 
      }
    }
  }