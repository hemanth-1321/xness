import client from "@repo/db/client"

async function Connection() {
    try {
        await client.connect()

        const query = await client.query(`
    
            CREATE TABLE IF NOT EXISTS trades(
            time TIMESTAMP WITH TIME ZONE NOT NULL,
            symbol TEXT NOT NULL,
            price  DOUBLE PRECISION NOT NULL,
            volume  DOUBLE PRECISION NOT NULL,
            trade_id BIGINT NOT NULL,
            PRIMARY KEY(symbol,trade_id)        
        )
        SELECT create_hypertable('trades',if_not_exists => TRUE)
 `)


 await client.query(`
    
    
    CREATE MATERIAL VIEW IF NOT EXISTS candles_1
    with(timescaledb.continuous) AS
    SELECT
        time_bucket('1 minute',time) AS BUCKET,
        symbol,
    FROM trades
    `
    );
    } catch (error) {

        console.log("error", error)
    }
}

Connection()