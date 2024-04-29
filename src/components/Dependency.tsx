import { FaRegCircleCheck } from 'react-icons/fa6';

interface DependencyProps {
  name: string;
  versions: string[];
  popularity: number;
}
const Dependency = (props: DependencyProps) => {
  return (
    <>
      {props.popularity > 40 && <FaRegCircleCheck className="w-5 h-5 self-end" />}
      <span className="col-start-2">{props.name}</span>
      <span className="col-start-3 flex gap-2">
        {props.versions.map((version, index) => (
          <span key={index} className="rounded-full bg-gray-800 text-white px-2">
            {version}
          </span>
        ))}
      </span>
    </>
  );
};

export default Dependency;
