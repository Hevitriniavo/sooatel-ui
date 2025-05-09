import { useTitleStore } from '../../stores/useTitleStore';

const Breadcrumb = () => {
  const title = useTitleStore(state => state.title);
  return (
    <div className="Breadcrumb z-10 lg:z-10 mb-6 bg-white p-3 rounded flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-gray-500 dark:text-white">
        {title}
      </h2>
    </div>
  );
};

export default Breadcrumb;
