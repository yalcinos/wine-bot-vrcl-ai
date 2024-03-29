import { Commerce7API } from "@/lib/commerce7-api";
import { wineProductData } from "@/lib/prompts/promptFunction/wine-product-data";

export const functions: any[] = [
  {
    type: "function",
    function: {
      name: "get_reservations",
      description: "Get the reservation list.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_wine_product_information",
      description: "Get list of wine product information",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_wine_sku",
      description: "Retrieve wine product sku for Add to Cart link",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

async function get_wine_product_information(
  tenantId: string,
  websiteUrl: string
) {
  const products = await Commerce7API(tenantId, "v1/product");

  return wineProductData(products, websiteUrl);
}

async function get_wine_sku(tenantId: string) {
  const products = await Commerce7API(tenantId, "v1/product");

  const skus = products.products.flatMap((product: any) =>
    product.variants.map((variant: any) => variant.sku)
  );
  console.log({ skus });
  return skus;
}

async function get_reservations(
  tenantId: string,
  customerId: string,
  status: string,
  dateRange: string
) {
  const reservations = await Commerce7API(tenantId, "v1/reservation", {
    customerId: customerId,
    status: status,
    reservationDate: dateRange,
  });

  if (!reservations || reservations.total === 0) {
    return null;
  }

  const getReservationResponse = reservations?.reservations?.map(
    (reservation: any) => {
      if (reservation) {
        return {
          // reservationNo: reservation.reservationNumber,
          guest: reservation.guestCount,
          name: reservation.customer.firstName,
          address: reservation.inventoryLocation.address,
          city: reservation.inventoryLocation.city,
          // state: reservation.inventoryLocation.state,
        };
      } else return null;
    }
  );

  return getReservationResponse;
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "get_wine_product_information":
      return await get_wine_product_information(
        args["tenantId"],
        args["websiteUrl"]
      );
    case "get_wine_sku":
      return await get_wine_sku(args["tenantId"]);
    case "get_reservations":
      return await get_reservations(
        args["tenantId"],
        args["customerId"],
        args["status"],
        args["dateRange"]
      );
    default:
      return null;
  }
}
