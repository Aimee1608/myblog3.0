import { getAllCategories, getAllTags } from '@/lib/queries';
import { addCategory, deleteCategory, addTag, deleteTag } from './actions';

export const dynamic = 'force-dynamic';

export default async function TaxonomyPage() {
  const [categories, tags] = await Promise.all([getAllCategories(), getAllTags()]);

  const addInput =
    'rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900';

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <section>
        <h1 className="mb-4 text-xl font-bold">分类（{categories.length}）</h1>
        <form action={addCategory} className="mb-4 flex gap-2">
          <input name="name" placeholder="新分类名" required className={addInput} />
          <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white">添加</button>
        </form>
        <ul className="space-y-2 text-sm">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between border-b border-gray-100 py-1 dark:border-gray-800">
              <span>{c.name}</span>
              <form action={deleteCategory.bind(null, c.id)}>
                <button className="text-xs text-red-500 hover:text-red-700">删除</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h1 className="mb-4 text-xl font-bold">标签（{tags.length}）</h1>
        <form action={addTag} className="mb-4 flex gap-2">
          <input name="name" placeholder="新标签名" required className={addInput} />
          <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white">添加</button>
        </form>
        <ul className="space-y-2 text-sm">
          {tags.map((t) => (
            <li key={t.id} className="flex items-center justify-between border-b border-gray-100 py-1 dark:border-gray-800">
              <span>#{t.name}</span>
              <form action={deleteTag.bind(null, t.id)}>
                <button className="text-xs text-red-500 hover:text-red-700">删除</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
