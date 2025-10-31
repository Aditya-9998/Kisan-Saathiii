// C:\Users\Aditya Kumar\Acadimic\Program\Projects\Completed\Kissan Saktiii\data\soils.js

export const soils = [
    {
        id: "alluvial",
        name: "Alluvial soil",
        hindi: "जलोढ़ मिट्टी",
        bgImage: "C:\\Users\\Aditya Kumar\\Acadimic\\Program\\Projects\\Completed\\Kissan Saktiii\\images\\Alluvial Soil.jpg",
        regions: "Northern Plains, River Valleys...",
        crops: ["Rice", "Wheat", "Sugarcane", "Cotton", "Jute", "Groundnut", "Soybean", "Millets", "Pulses", "Orange", "Mustard", "Barley", "Maize"],
        
        note: "Fertile river plains; good for a wide range of crops"
    },
    {
        id: "black",
        name: "Black soil",
        hindi: "काली मिट्टी",
        bgImage: "C:\\Users\\Aditya Kumar\\Acadimic\\Program\\Projects\\Completed\\Kissan Saktiii\\images\\black-soil.jpg",
        regions: "Deccan Plateau...",
        crops: ["Cotton", "Soybean", "Wheat", "Groundnut", "Sugarcane", "Millets", "Pulses", "Watermelon", "Muskmelon", "Cucumber", "BottleGourd", "GreenGram", "BlackGram", "Okra", "Cowpea", "Barley", "Maize"],
        
        note: "Excellent moisture retention; good for cotton and soybean"
    },
    {
        id: "red",
        name: "Red soil",
        hindi: "लाल मिट्टी",
        bgImage: "C:\\Users\\Aditya Kumar\\Acadimic\\Program\\Projects\\Completed\\Kissan Saktiii\\images\\Red-soil.webp",
        regions: "TN, Karnataka, Odisha...",
        crops: ["Millets", "Pulses", "Groundnut", "Potato", "Rice", "Soybean", "Bajra", "Cashew", "Maize"],
        
        note: "Needs organic matter & fertilizers for better yields"
    },
    {
        id: "laterite",
        name: "Laterite soil",
        hindi: "लेटराइट मिट्टी",
        bgImage: "C:\\Users\\Aditya Kumar\\Acadimic\\Program\\Projects\\Completed\\Kissan Saktiii\\images\\Laterite Soil.jpg",
        regions: "Western Ghats, Eastern Ghats...",
        crops: ["Tea", "Coffee", "Cashew", "Rubber", "Rice"],
        
        note: "Acidic soils — suited for plantation crops"
    },
    {
        id: "desert",
        name: "Desert soil",
        hindi: "रेगिस्तानी मिट्टी",
        bgImage: "C:\\Users\\Aditya Kumar\\Acadimic\\Program\\Projects\\Completed\\Kissan Saktiii\\images\\Desert.webp",
        regions: "Rajasthan, parts of Gujarat...",
        crops: ["Barley", "Bajra", "Pulses", "Watermelon", "Muskmelon", "Cucumber", "ClusterBean", "PearlMillet"],
        
        note: "Irrigation and soil amendments needed"
    },
    {
        id: "mountain",
        name: "Mountain soil",
        hindi: "पर्वतीय मिट्टी",
        bgImage: "C:\\Users\\Aditya Kumar\\Acadimic\\Program\\Projects\\Completed\\Kissan Saktiii\\images\\Mountain Soil.webp",
        regions: "Himalayan regions...",
        crops: ["Tea", "Coffee", "Spices", "Apple", "Orange", "Wheat", "Rice", "Maize", "Rubber"],
        
        note: "Good for horticulture and plantation crops"
    },
    {
        id: "saline",
        name: "Alkaline soil",
        hindi: "क्षारीय मिट्टी",
        bgImage: "C:\\Users\\Aditya Kumar\\Acadimic\\Program\\Projects\\Completed\\Kissan Saktiii\\images\\Saline-Alkaline Soil.webp",
        regions: "Drier parts of UP, Bihar...",
        crops: ["Rice", "Wheat", "Barley"],
        
        note: "Requires reclamation and gypsum application"
    },
    {
        id: "peaty",
        name: "Peaty Soil",
        hindi: "दलदली मिट्टी",
        bgImage: "C:\\Users\\Aditya Kumar\\Acadimic\\Program\\Projects\\Completed\\Kissan Saktiii\\images\\Peaty-Marshy Soil.jpg",
        regions: "Kerala, West Bengal...",
        crops: ["Rice", "Jute", "Lentil", "Khesari", "WaterSpinach", "Berseem", "Wheat_Peaty"],
        
        note: "High organic matter — good for rice, jute"
    }
];

export const seasonsInfo = {
    kharif: { months: "June - October", hindi: "खरीफ (जून - अक्टूबर)" },
    rabi: { months: "November - April", hindi: "रबी (नवंबर - अप्रैल)" },
    zaid: { months: "March - June", hindi: "जायद (मार्च - जून)" }
};

export function getSoilRegions(soilId) {
    const soil = soils.find(s => s.id === soilId);
    return soil ? soil.regions : "Regions not specified.";
}