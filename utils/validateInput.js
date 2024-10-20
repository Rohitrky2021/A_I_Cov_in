exports.validatePercentage = (participants) => {
    const totalPercentage = participants.reduce((acc, p) => acc + p.percentage, 0);
    return totalPercentage === 100;
  };
  