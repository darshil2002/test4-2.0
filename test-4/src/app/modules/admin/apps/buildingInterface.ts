export interface Root {
    success: boolean
    message: string
    configs: Config[]
  }
  
  export interface Config {
    uniqueId: string
    buildingNo?: string
    buildingName: string
    description: any
    date_constructed?: string
    architect?: string
    contractor: any
    construction_Cost?: string
    renovation_History: any
    campus: Campu[]
    zone?: Zone[]
    floorList: any
    wingList: any
    isActive: boolean
    unitCost: any
    extendedCost: any
    buildingImage?: string
    buildingConfig: any[]
    noOFFloors: any
  }
  
  export interface Campu {
    campusId: string
    name: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: any
    zipCode: string
    country: string
    county: string
    assets: any
    createdBy: any
    createdOn: any
    modifiedOn: any
    modifiedBy: any
    status: number
    no: any
    territory: string
    campusImage: any
    custodialCrewLeader: any
    campusType: any
    clientID: string
  }
  
  export interface Zone {
    zoneId: string
    name: string
    createdBy: any
    createdOn: any
    modifiedOn: any
    modifiedBy: any
    status: number
    no: any
    clientID: string
  }
  