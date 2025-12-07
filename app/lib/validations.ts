import { z } from "zod";

// Phone validation
export const phoneSchema = z.object({
  phone_number: z.string().min(10).max(15),
  phone_type: z.enum(["Mobile", "Home", "Work"]),
  customer_id: z.number().int().optional(), // Optional for frontend form, required in API
});

// Customer validation
export const customerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  notes: z.string().optional()
});

// Email validation
export const emailSchema = z.object({
  email_address: z.string().email('Invalid email address'),
  email_type: z.string().min(1, 'Email type is required').optional(),
  customer_id: z.number().int().optional(),
});

// Address validation
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2).max(2, 'State must be 2 characters'),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code'),
  customer_id: z.number().int().optional(),
});

// Car validation
export const carSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().length(17, 'VIN must be 17 characters').optional(),
  customer_id: z.number().int().optional(),
});

//estimate validation
export const estimateSchema = z.object({
  date: z.string().min(10).max(10),
  hours_taken: z.number().min(0),
  miles: z.number().min(0),
  estimate_type: z.enum(["initial", "estimate", "repair_order"]),
  private_notes: z.string().max(500).optional(),
  public_notes: z.string().max(500).optional(),
  car_id: z.number().int().positive(),
});

export const adminSchema = z.object({
  tax: z.number().min(0).max(100),
  labor_rate: z.number().min(0),
  shop_fee_threshold: z.number().min(0),
  shop_fee_rate: z.number().min(0), 
});

export const markupSchema = z.object({
  value: z.number().min(0),
  multiplier: z.number().min(1),
});

// For API use - add required customer_id
export const phoneSchemaWithCustomer = phoneSchema.extend({
  customer_id: z.number().int()
});

export const emailSchemaWithCustomer = emailSchema.extend({
  customer_id: z.number().int()
});

export const addressSchemaWithCustomer = addressSchema.extend({
  customer_id: z.number().int()
});

export const carSchemaWithCustomer = carSchema.extend({
  customer_id: z.number().int()
});
