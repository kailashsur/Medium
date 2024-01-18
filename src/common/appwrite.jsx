
import { Client, Account, ID, Databases, Storage, Query } from 'appwrite'

export class Service {
    client = new Client();
    bucket;

    constructor() {
        this.client
            .setEndpoint(import.meta.env.VITE_APPWRITE_API_URL)
            .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

        this.bucket = new Storage(this.client);
    }

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error ", error);
            return false;
        }
    }
    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            fileId
        )
    }

    deleteImage(fileId) {
        return this.bucket.deleteFile(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            fileId
        )
    }
    downloadImage(fileId) {
        return this.bucket.getFileDownload(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            fileId
        )
    }
}
//let {$id, data : {href}} = await appwriteServices.uploadFile(img);


const appwriteServices = new Service();
export default appwriteServices