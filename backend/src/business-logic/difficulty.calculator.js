class DifficultyCalculator {
  async calculateDifficulty(track) {

    const summary = track.summary;

    var cmpIdx = summary.distance/1000+(summary.up/100);
    var CAI = summary.up/100 + summary.distance/2000;

    if (cmpIdx < 5 ){
        cmpIdx = "Easy";
    } else if (cmpIdx < 10){
        cmpIdx = "Medium";
    } else if (cmpIdx < 20){
        cmpIdx = "Hard";
    } else {
        cmpIdx = "Very hard";
    }

    if (CAI < 10) {
        CAI = "T1";
    } else if (CAI < 20) {
        CAI = "T2";
    } else if (CAI < 30) {
        CAI = "T3";
    } else {
        CAI = "T4";
    }

    return { cmpIdx, CAI };
  }
}

module.exports = new DifficultyCalculator();