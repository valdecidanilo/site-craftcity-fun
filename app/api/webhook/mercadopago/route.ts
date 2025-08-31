import { NextResponse } from 'next/server';

// TODO: Import your database and Minecraft command logic here

export async function POST(req: Request) {
  // Parse MercadoPago webhook payload
  const body = await req.json();
  // TODO: Validate webhook signature if needed

  // Check if payment is approved
  if (body.type === 'payment' && body.data?.id) {
    // Fetch payment details from MercadoPago if needed
    // TODO: Fetch order from DB using external_reference or payment id
    // TODO: If payment is approved, update order status and execute Minecraft command
    // Example:
    // if (payment.status === 'approved') {
    //   await sendMinecraftCommand(order.command);
    //   await updateOrderAsCommandSent(order.id);
    // }
  }

  return NextResponse.json({ received: true });
}
