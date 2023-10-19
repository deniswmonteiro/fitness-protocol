import { Db, MongoClient, WithId } from "mongodb";

type ISequence = WithId<Document> & {
    description: string,
    value: number
};

export async function dbConnect() {
    return await MongoClient.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cwxr3dv.mongodb.net/${process.env.DB_NAME}`);
}

export async function getId(description: string, db: Db) {
    const sequenceCollection = db.collection("sequence");
    const sequence = await sequenceCollection.findOne({ description }) as ISequence;
    let newSequence: number;

    if (!sequence) {
        await sequenceCollection.insertOne({
            description,
            value: 1
        });
    }

    else {
        const sequenceValue = Number(sequence.value) + 1;
        
        await sequenceCollection.updateOne({ description }, {
            $set: {
                value: sequenceValue
            }
        });
    }

    newSequence = sequence.value ;
    
    return newSequence;
}