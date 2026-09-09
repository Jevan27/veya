import React from 'react';
import { comparisonContent } from '../../content/landing';
import { XCircle, CheckCircle2, Scale } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  return (
    <section className="section-wrapper" id="comparison">
      <div className="section-container">
        <div className="section-header-center">
          <div className="badge-pill">
            <Scale size={13} color="#000000" />
            <span>Comparison</span>
          </div>
          <h2 className="section-heading">Traditional Cards vs. Veya Digital Cards</h2>
          <p className="section-lead">
            See why modern professionals are leaving printed cardboard behind for intelligent
            digital cards.
          </p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '28%' }}>
                  Dimension
                </th>
                <th scope="col" style={{ width: '36%' }}>
                  <div className="table-header-cell">
                    <XCircle size={16} color="#71717A" />
                    <span>Traditional Cards</span>
                  </div>
                </th>
                <th scope="col" style={{ width: '36%' }} className="veya-column-header">
                  <div className="table-header-cell">
                    <CheckCircle2 size={16} color="#FFFFFF" />
                    <span>Veya Digital Cards</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonContent.map((row, idx) => (
                <tr key={idx}>
                  <td className="dimension-cell">{row.aspect}</td>
                  <td className="traditional-cell">{row.traditional}</td>
                  <td className="veya-cell">
                    <span className="veya-cell-check">
                      <CheckCircle2 size={15} color="#000000" />
                    </span>
                    <span>{row.veya}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
