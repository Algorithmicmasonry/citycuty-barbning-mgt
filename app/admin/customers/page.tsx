import { CustomerRecords } from "@/components/admin";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

async function getCustomersData() {
  const customers = await prisma.customer.findMany({
    include: {
      services: {
        orderBy: {
          serviceDate: "desc",
        },
        select: {
          serviceDate: true,
          amountPaid: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform the data
  const customersData = customers.map((customer) => {
    const totalSpent = customer.services.reduce(
      (sum, service) => sum + Number(service.amountPaid),
      0
    );

    const lastVisit =
      customer.services.length > 0
        ? format(new Date(customer.services[0].serviceDate), "MMM d, yyyy")
        : "No visits yet";

    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      visits: customer.services.length,
      lastVisit,
      totalSpent,
      hasVisits: customer.services.length > 0,
    };
  });

  return customersData;
}

const CustomersPage = async () => {
  const customersData = await getCustomersData();

  return <CustomerRecords customers={customersData} />;
};

export default CustomersPage;
