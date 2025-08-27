import client from "@repo/db/client"

async function Connection() {
    try {
        await client.connect()

        const query = await client.query(`
        
        CEATE TABLE trades(

        time TIMESTAMP WITH TIME ZONE NOT NULL,
        

        )    
        WITH(


        )
 `)
    } catch (error) {

        console.log("error", error)
    }
}

Connection()