interface IFilterReservation {
    id: string
    people?: number
    time: string
    date: string
    assigned: boolean
    table: string
    rawTime: Date // Store the raw date for sorting and filtering
}

interface IReservation {
    id: string
    name: string
    phone: string
    status: string
    people: number
    table: string
}

interface IDineInTableStats {
    table_number: string
    status: string
    booked_at: string
    items: {
        name: string
        quantity: number
        price: number
        order_id: string
        order_status: string
        dish_id: string
        total: number
    }[]
    total_amount: number
    booking_id?: string
    checkout_id?: string | null 
}