        import client from "./index"

        async function Connection() {
            try {
                await client.connect()

                await client.query(`
            
                    CREATE TABLE IF NOT EXISTS trades(
                    time TIMESTAMP WITH TIME ZONE NOT NULL,
                    symbol TEXT NOT NULL,
                    price  DOUBLE PRECISION NOT NULL,
                    volume  DOUBLE PRECISION NOT NULL,
                    trade_id BIGINT NOT NULL
                    
                )
        `)



        await client.query(`
            SELECT create_hypertable('trades', 'time', if_not_exists => TRUE);
            `);

    

            async function createCandle(interval:string,viewName:string,schedule:string){
                await client.query(`
                    CREATE MATERIALIZED VIEW IF NOT EXISTS ${viewName}
                    WITH (timescaledb.continuous) AS
                    SELECT
                        time_bucket('${interval}', time) AS bucket,
                        symbol,
                        first(price, time) AS open,
                        max(price) AS high,
                        min(price) AS low,
                        last(price, time) AS close,
                        sum(volume) AS volume
                    FROM trades
                    GROUP BY bucket, symbol;
                `);

                
                await client.query(`
                    SELECT add_continuous_aggregate_policy('${viewName}',
                        start_offset => INTERVAL '7 days',
                        end_offset   => INTERVAL '${interval}', 
                        schedule_interval => INTERVAL '${schedule}'
                    );
                `);
            }
            


            await createCandle("1 minute", "candles_1m", "1 minute");
            await createCandle("5 minutes", "candles_5m", "5 minutes");
            await createCandle("10 minutes", "candles_10m", "10 minutes");
            await createCandle("30 minutes", "candles_30m", "30 minutes");
            await createCandle("1 hour", "candles_1h", "1 hour");
            await createCandle("1 day", "candles_1d", "1 day");

            console.log("Tables and continuous aggregates created successfully!");
            } catch (error) {

                console.log("error", error)

            }finally{
                  await client.end(); 
            }
        }

        Connection()