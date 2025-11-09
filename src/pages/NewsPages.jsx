import { articles } from "../data/siteContent.json";
export default function NewsPages(){
    return(
    <div className="flex justify-around p-4 ">
         {articles.length > 0 ? (
        <div className="grid gap-4">
           {articles.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-2">
                {item.title || "Tanpa Judul"}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {item.description || "Tidak ada deskripsi"}
              </p>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {idx+1}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Tidak ada berita terkini.</p>
        </div>
      )}
    </div>
    )
}