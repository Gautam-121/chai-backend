import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: "",
    api_key: "",
    api_secret: ""
})

export default uploadOnCloudinary = async(localFilePath)=>{
    try {

        if(!localFilePath){
            return null
        }
    
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        // File Uploaded on Cloudinary Successfully
        fs.unlinkSync(localFilePath)

        return response

    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}