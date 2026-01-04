import React from 'react';

interface FormattedChatMessageProps {
  content: string;
  mode?: 'tiktok' | 'marketing';
}

export function FormattedChatMessage({ content, mode = 'tiktok' }: FormattedChatMessageProps) {
  const lines = content.split('\n');
  const result: React.ReactNode[] = [];
  let tableBuffer: string[] = [];
  let inTable = false;

  const accentColor = mode === 'tiktok' ? 'pink' : 'purple';

  const flushTable = (key: number) => {
    if (tableBuffer.length === 0) return null;
    
    const rows = tableBuffer.map(row => 
      row.split('|').filter(cell => cell.trim() && !cell.match(/^[\s-]+$/))
    ).filter(cells => cells.length > 0);

    if (rows.length === 0) {
      tableBuffer = [];
      return null;
    }

    const hasHeader = tableBuffer.some(line => line.includes('---') || line.includes('—'));
    const headerIdx = tableBuffer.findIndex(line => line.includes('---') || line.includes('—'));
    
    const headerRow = headerIdx > 0 ? rows[0] : null;
    const dataRows = headerIdx > 0 ? rows.slice(1).filter((_, i) => 
      !tableBuffer[i + 1]?.includes('---')
    ) : rows;

    tableBuffer = [];

    return (
      <div key={key} className="my-2 overflow-x-auto -mx-2 px-2">
        <div className="min-w-fit rounded-lg overflow-hidden border border-white/10 bg-white/5">
          <table className="w-full text-xs sm:text-sm">
            {headerRow && headerRow.length > 0 && (
              <thead>
                <tr className={`bg-${accentColor}-500/20 border-b border-white/10`}>
                  {headerRow.map((cell, i) => (
                    <th key={i} className={`px-2 sm:px-3 py-1.5 sm:py-2 text-left font-medium text-${accentColor}-300 whitespace-nowrap`}>
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-white/5">
              {dataRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className={`px-2 sm:px-3 py-1.5 sm:py-2 ${cellIdx === 0 ? `text-${accentColor}-400 font-medium` : 'text-gray-300'} whitespace-nowrap`}>
                      {renderCellContent(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCellContent = (cell: string): React.ReactNode => {
    if (cell === '✅' || cell === '🟢' || cell.includes('✅')) return <span className="text-green-400">{cell}</span>;
    if (cell === '⚠️' || cell === '🟡' || cell.includes('⚠️') || cell.includes('🔶')) return <span className="text-yellow-400">{cell}</span>;
    if (cell === '❌' || cell === '🔴' || cell.includes('❌')) return <span className="text-red-400">{cell}</span>;
    if (cell.match(/^\d+(\.\d+)?[%KMkmx]?$/)) return <span className="text-cyan-400 font-mono">{cell}</span>;
    return cell;
  };

  const isTableLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed.includes('|')) return false;
    if (trimmed.match(/^\|[\s-]+\|/)) return true;
    if (trimmed.startsWith('|') || trimmed.endsWith('|')) return true;
    const pipeCount = (trimmed.match(/\|/g) || []).length;
    return pipeCount >= 2;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (isTableLine(line)) {
      if (!inTable) {
        inTable = true;
      }
      tableBuffer.push(line);
      continue;
    }
    
    if (inTable) {
      const tableNode = flushTable(result.length);
      if (tableNode) result.push(tableNode);
      inTable = false;
    }

    if (line.startsWith('# ')) {
      result.push(
        <h1 key={i} className={`text-lg font-bold text-${accentColor}-400 mt-4 mb-2`}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      result.push(
        <h2 key={i} className="text-base font-semibold text-white mt-3 mb-1">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      result.push(
        <h3 key={i} className={`text-sm font-medium text-${accentColor}-400 mt-2`}>
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      result.push(
        <h4 key={i} className="text-sm font-medium text-gray-300 mt-2">
          {line.slice(5)}
        </h4>
      );
    } else if (line.trim() === '---' || line.trim() === '***') {
      result.push(<hr key={i} className="border-white/10 my-3" />);
    } else if (line.startsWith('>')) {
      result.push(
        <div key={i} className={`border-l-2 border-${accentColor}-500 pl-3 py-1 bg-${accentColor}-500/5 rounded-r text-gray-300 italic my-1`}>
          {line.slice(1).trim()}
        </div>
      );
    } else if (line.trim().match(/^[-•]\s/)) {
      const formatted = formatInlineStyles(line.replace(/^[\s]*[-•]\s*/, ''));
      result.push(
        <div key={i} className="flex gap-2 pl-2 my-0.5">
          <span className={`text-${accentColor}-400 flex-shrink-0`}>•</span>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
        </div>
      );
    } else if (line.trim().match(/^\d+\.\s/)) {
      const match = line.match(/^(\s*)(\d+)\.\s(.*)$/);
      if (match) {
        const formatted = formatInlineStyles(match[3]);
        result.push(
          <div key={i} className="flex gap-2 pl-2 my-0.5">
            <span className="text-cyan-400 font-medium flex-shrink-0 min-w-[1.5rem]">{match[2]}.</span>
            <span dangerouslySetInnerHTML={{ __html: formatted }} />
          </div>
        );
      }
    } else if (line.trim().startsWith('```')) {
      result.push(
        <div key={i} className="bg-black/30 rounded px-3 py-1 font-mono text-xs text-gray-300 my-1">
          {line.replace(/```\w*/, '').trim()}
        </div>
      );
    } else if (line.trim() === '') {
      result.push(<div key={i} className="h-2" />);
    } else {
      const formatted = formatInlineStyles(line);
      result.push(<p key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />);
    }
  }

  if (inTable && tableBuffer.length > 0) {
    const tableNode = flushTable(result.length);
    if (tableNode) result.push(tableNode);
  }

  return <div className="space-y-0.5 text-gray-300 text-sm leading-relaxed">{result}</div>;
}

function formatInlineStyles(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-gray-400">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-pink-300 text-xs font-mono">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-cyan-400 hover:underline">$1</a>');
}
