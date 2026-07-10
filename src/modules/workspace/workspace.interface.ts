


// interface IworkSpace{
//     workSpaceId:string,
//     name:string,
//     type:"family" |"student"
//     ownerId:string, /// ref ( ownerId or id)

// }

type WorkSpaceType= "Family"  | "Students"

export interface IWorkSpace{
    name:string,
    type: WorkSpaceType,
    ownerId:string

}