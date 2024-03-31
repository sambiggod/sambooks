/**
 * https://zhuanlan.zhihu.com/p/687709843
 */
function databaseProxy() {
    const database = {
        users: [
            {
                id: 1,
                name: 'alice',
                age: 245
            },
            {
                id: 2,
                name: 'bob',
                age: 30
            },
        ],
        posts: [
            {

            }
        ]
    }

    const createORM = (database) => {
        return new Proxy(database, {
            get(target, property, receiver) {
                if (property === 'findValueById') {
                    return () => {
                        return 'findValueById';
                    }
                }

                return Reflect.get(target, property, receiver);
            },
        })
    }

    const users = createORM(database);
    console.log('users: ', users.findValueById())
}

databaseProxy();


function cacheRedis() {
    const redis = require('redis');
    const { promisify } = require('node:util');
    const client = redis.createClient();
    async function queryDatabase(query) {
        console.log(`Executing database query: ${query}`);
        return `Result for query: ${query}`;
    }

    const cachedDatabaseQuery = new Proxy(queryDatabase, {
        async apply(target, thisArg, argArray) {
            const query = argArray[0];
            const cacheKey = `cache: ${query}`;

            const cachedResult = await promisify(client.get).bind(client)(cacheKey);
            if (cachedResult) {
                console.log(`Cache hit! Returning cached result for query: ${query}`);
                return cachedResult;
            }

            const result = await target(...argArray);

            await promisify(client.set).bind(client)(cacheKey, result);
            
            console.log(`Database query result stored in cache for query: ${query}`);
            return result;
        }
    })

    async function testProxy() {
        const result1 = await cachedDatabaseQuery('SELECT * FROM users WHERE id = 1');
        const result2 = await cachedDatabaseQuery('SELECT * FROM users WHERE id = 2');
        const result3 = await cachedDatabaseQuery('SELECT * FROM users WHERE id = 1');
        
        console.log(result1);
        console.log(result2);
        console.log(result3);
    }
    
    testProxy();
}

cacheRedis();
