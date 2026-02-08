import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-slate-900 p-6 rounded-xl border border-slate-800"
    >
      <h3 className="text-xl font-semibold">{job.title}</h3>
      <p className="text-gray-400 mt-1">{job.company}</p>

      <div className="flex gap-4 mt-3 text-sm text-gray-300">
        <span>{job.location}</span>
        <span>{job.type}</span>
      </div>

      <Link
        to={`/jobs/${job._id}`}
        className="inline-block mt-4 text-indigo-400 hover:underline"
      >
        View Details →
      </Link>
    </motion.div>
  );
}
