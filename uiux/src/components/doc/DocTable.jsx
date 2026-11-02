/**
 * 문서용 표
 *
 * <DocTable
 *     columns={['클래스', '설명']}
 *     rows={[
 *         [<code>btn_top</code>, '페이지 최상단 버튼'],
 *     ]}
 * />
 *
 * rows 의 각 칸에는 문자열 또는 JSX 를 넣을 수 있습니다.
 * rowKey 를 넘기지 않으면 첫 칸의 문자열(없으면 순번)을 key 로 씁니다.
 */
export default function DocTable({ columns, rows, rowKey }) {
    const getKey = (row, index) => {
        if (rowKey) {
            return rowKey(row, index);
        }
        return typeof row[0] === 'string' ? `${row[0]}-${index}` : index;
    };

    return (
        <div className="g-table-wrap">
            <table className="g-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column} scope="col">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={getKey(row, rowIndex)}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * "클래스 → 설명" 표 (컴포넌트 페이지에서 반복되는 형태)
 * items: [{ name: 'btn_top', desc: '…' }]
 */
export function ClassTable({ items, columns = ['Class', '설명'] }) {
    return (
        <DocTable
            columns={columns}
            rows={items.map((item) => [<span className="g-class-name">.{item.name}</span>, item.desc])}
            rowKey={(row, index) => items[index].name}
        />
    );
}
