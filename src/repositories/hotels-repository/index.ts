import { prisma } from "@/config";


function getHotels(){
    return prisma.hotel.findMany()
}

function getRooms(hotelId: number){
    return prisma.hotel.findFirst({
        where: {id: hotelId},
        include: {Rooms: true}
    })
}

const hotelsRepository = {
    getHotels,
    getRooms
}

export default hotelsRepository