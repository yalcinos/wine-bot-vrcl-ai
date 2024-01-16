import { Commerce7API } from "@/lib/commerce7-api";

export const functions: any[] = [
  {
    type: "function",
    function: {
      name: "get_reservations",
      description:
        "Get the reservation list, if you can not find any reservation say sory",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

async function get_reservations(
  tenantId: string,
  customerId: string,
  status: string,
  dateRange: string
) {
  console.log("lol", tenantId, customerId, status, dateRange);
  let response;
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
          reservationNumber: reservation.reservationNumber,
          guestCount: reservation.guestCount,
          firstName: reservation.customer.firstName,
          reservationAddress: reservation.inventoryLocation.address,
          reservationCity: reservation.inventoryLocation.city,
          reservationState: reservation.inventoryLocation.state,
          // customer: `${reservation.guestCount} guests for ${reservation.customer.firstName} ${reservation.customer.lastName}`,
        };
      } else return null;
    }
  );

  return getReservationResponse;
}

export async function runFunction(name: string, args: any) {
  switch (name) {
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
