import  {GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3' 
import {getSignedUrl}  from  '@aws-sdk/s3-request-presigner'
import {env} from './env.config'

const region=env.AWS_S3_REGION as string
const accessKeyID=env.AWS_S3_ACCESS_KEY as string
const secreteAccessKey=env.AWS_S3_SECRET_KEY as string
const bucketName=env.AWS_s3_BUCKET_NAME as string

const s3Bucket=new  S3Client({
    region:region,
    credentials:{
        accessKeyId:accessKeyID,
        secretAccessKey:secreteAccessKey
    }
})

export async function getObjectURL(key:string){
    const command=new  GetObjectCommand({
        Bucket:bucketName,
        Key:key
    });
    const getURL=await getSignedUrl(s3Bucket,command,{expiresIn:300})
    return getURL
}

export async function  putObjectURl(filename:string,type:string):Promise<{uploadURL:string,fileURL:string}>{
   console.log(filename,'8888',type)
    let folderName=''
    console.log(type)
    if(type.startsWith('image/')){
        folderName='upload/images'
    }else if(type.startsWith('application/pdf')){
        folderName='upload/pdf'
    }else{
        folderName='upload/other'
    }
    const key=`${folderName}/${Date.now()}-${filename}`

    const command=new PutObjectCommand({
        Bucket:bucketName,
        Key:key,
        ContentType:type
    })

    const uploadURL=await  getSignedUrl(s3Bucket,command)
    const fileURL = key;
   return {uploadURL,fileURL}
}