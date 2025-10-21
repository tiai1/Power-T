function computeWaterfall(data) {
  let runningTotal = data.start;
  const items = data.items.map((item, i) => {
    const runningStart = runningTotal;
    runningTotal += item.value;
    return { 
      ...item, 
      runningStart,
      runningEnd: runningTotal
    };
  });
  
  const values = [data.start, ...items.map(it => it.runningEnd)];
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return { items, min, max };
}

module.exports = { computeWaterfall };
