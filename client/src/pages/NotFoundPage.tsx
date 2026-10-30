import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="card text-center py-12 max-w-md mx-auto my-8 space-y-4">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-forest-50 text-forest flex items-center justify-center">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-charcoal">Page Not Found (पेज नहीं मिला)</h1>
        <p className="text-xs text-charcoal-muted mt-1">
          The requested route does not exist in MehnatNama.
        </p>
      </div>
      <div>
        <Link to="/" className="btn-primary">
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home (होम पर जाएं)</span>
        </Link>
      </div>
    </div>
  );
};
