const categories=["All","Music","Gaming","Coading","News","Sports","Education","Entertainment"];
const categoryBar=({selectedCategory,setSelectedCategory})=>{
    return(
        <div className="category-bar">
            {categories.map((category)=>{
                <button key={category} className={selectedCategory === category ? "category-active":""}
                onClick={()=>setSelectedCategory(category)}>{category}</button>
            })}
        </div>
    )
};
export default categoryBar;