export const trainingContent = {
  cpr_adult: {
    introduction: "This exercise trains you on the correct rhythm and depth for adult CPR compressions. The goal is to maintain a pace of 100-120 beats per minute. Listen to the beat and try to match it.",
    steps: [],
    mistakes: ["Compressing too fast or too slow (outside 100-120 BPM)", "Not compressing deep enough (should be at least 2 inches)", "Leaning on the chest between compressions"],
    success_criteria: "You maintained the correct CPR rhythm for the duration of the exercise."
  },
  cpr_child: {
    introduction: "This module teaches the modified CPR technique for children (age 1 to puberty). The core principles are the same as adult CPR, but with adjustments for a child's smaller size.",
    steps: [
      { action: "Check for response and breathing.", timing: "10 seconds", tip: "Tap their shoulder and shout. Check for breathing simultaneously. If unresponsive and not breathing, tell someone to call 911." },
      { action: "Position your hand(s) on the center of the chest.", timing: "Positioning", tip: "For a small child, one hand may be enough. For a larger child, use two hands like in adult CPR." },
      { action: "Begin chest compressions.", timing: "100-120 per minute", tip: "Press down about 2 inches (5 cm) deep. Let the chest fully recoil between each compression." },
      { action: "Give 30 compressions.", timing: "15-18 seconds", tip: "Count aloud to maintain a steady rhythm. The song 'Stayin' Alive' is a good tempo guide." },
      { action: "Open the airway.", timing: "Positioning", tip: "Gently tilt the head back and lift the chin to open the airway for rescue breaths." },
      { action: "Give 2 rescue breaths.", timing: "1 second per breath", tip: "Watch for the chest to rise with each breath. If it doesn't, reposition the head and try again." },
      { action: "Continue cycles of 30 compressions and 2 breaths.", timing: "Ongoing", tip: "Don't stop until help arrives, an AED is ready, or the child shows signs of life." },
      { action: "If an AED arrives, use it immediately.", timing: "As needed", tip: "Follow the AED's voice prompts. It will tell you exactly what to do." }
    ],
    mistakes: ["Not compressing deep enough (less than 2 inches)", "Forgetting to let the chest fully recoil", "Taking too long to give rescue breaths"],
    success_criteria: "You can recall and describe the correct sequence of actions for child CPR."
  },
  choking_adult: {
    introduction: "Learn the universal first aid procedure for a conscious adult who is choking: a combination of back blows and abdominal thrusts (the Heimlich maneuver).",
    steps: [
      { action: "Ask 'Are you choking? Can you speak?'", timing: "Assessment", tip: "If they can speak or cough, encourage them to keep coughing. Do not intervene yet." },
      { action: "If they can't speak or cough, stand behind them.", timing: "Positioning", tip: "Lean the person forward slightly to help dislodge the object with gravity." },
      { action: "Give 5 firm back blows.", timing: "5 blows", tip: "Use the heel of your hand and strike them firmly between their shoulder blades." },
      { action: "Check if the object is out. If not, prepare for abdominal thrusts.", timing: "Assessment", tip: "Quickly look in their mouth after the back blows." },
      { action: "Position your hands for abdominal thrusts.", timing: "Positioning", tip: "Make a fist and place it just above their belly button. Grasp the fist with your other hand." },
      { action: "Perform 5 abdominal thrusts.", timing: "5 thrusts", tip: "Pull inward and upward with a quick, forceful motion, like you're trying to lift them up." },
      { action: "Continue alternating 5 back blows and 5 abdominal thrusts.", timing: "Ongoing", tip: "Keep repeating the cycle until the object is expelled or the person becomes unconscious." },
      { action: "If the person becomes unconscious, call 911 and begin CPR.", timing: "Emergency escalation", tip: "When you open the airway for breaths during CPR, look for the object and remove it if you see it." }
    ],
    mistakes: ["Performing the Heimlich maneuver on someone who can still cough", "Incorrect hand placement for thrusts (too high or too low)", "Giving weak back blows or thrusts"],
    success_criteria: "You can demonstrate the correct sequence and technique for back blows and abdominal thrusts."
  },
  choking_child: {
    introduction: "This module covers the technique for helping a conscious child (age 1 to puberty) who is choking. It is similar to the adult technique but requires less force.",
    steps: [
      { action: "Assess the situation.", timing: "Assessment", tip: "Ask the child 'Are you choking?'. If they are coughing, encourage them to continue." },
      { action: "If the child cannot cough or speak, get behind them.", timing: "Positioning", tip: "You may need to kneel to get to the right height. Lean the child forward." },
      { action: "Deliver 5 back blows.", timing: "5 blows", tip: "Strike firmly between the shoulder blades with the heel of your hand, but with less force than for an adult." },
      { action: "Check the mouth. If not clear, give 5 abdominal thrusts.", timing: "Assessment", tip: "Quickly check if the object has come out." },
      { action: "Position your hands for child abdominal thrusts.", timing: "Positioning", tip: "Make a fist and place it above their belly button, well below the ribs." },
      { action: "Perform 5 inward and upward thrusts.", timing: "5 thrusts", tip: "The motion is the same as for an adult, but be gentler." },
      { action: "Repeat the 5-and-5 cycle.", timing: "Ongoing", tip: "Continue alternating back blows and abdominal thrusts until the object is out or the child becomes unresponsive." },
      { action: "If the child becomes unconscious, start CPR.", timing: "Emergency escalation", tip: "Call 911 immediately and begin child CPR." }
    ],
    mistakes: ["Using too much force for a small child", "Incorrect hand placement", "Hesitating to act quickly"],
    success_criteria: "You can describe the modifications needed to perform choking first aid on a child compared to an adult."
  },
  aed_usage: {
    introduction: "An AED (Automated External Defibrillator) is a life-saving device. This module teaches you the simple, universal steps to use one correctly.",
    steps: [
      { action: "Turn on the AED.", timing: "Immediate", tip: "As soon as the AED arrives, turn it on. It will immediately start giving you voice instructions." },
      { action: "Expose the person's chest.", timing: "Preparation", tip: "Remove or cut clothing from the chest. Quickly wipe the chest dry if it's wet." },
      { action: "Attach the AED pads.", timing: "Placement", tip: "Peel the backing off the pads and apply them to the bare chest as shown in the diagrams on the pads themselves." },
      { action: "Plug in the pad connector.", timing: "Connection", tip: "The AED will prompt you to plug the pads' connector into the device, if it's not already connected." },
      { action: "Let the AED analyze the heart rhythm.", timing: "Analysis", tip: "STOP chest compressions. Make sure no one is touching the person. The AED will say 'Analyzing, do not touch the patient.'" },
      { action: "If a shock is advised, deliver the shock.", timing: "Shock", tip: "Loudly state 'CLEAR!' and make sure no one is touching the person. Press the flashing 'Shock' button." },
      { action: "Immediately resume CPR.", timing: "Compressions", tip: "After the shock, immediately start chest compressions again. Don't wait for the AED to tell you." },
      { action: "Follow the AED's ongoing prompts.", timing: "Ongoing", tip: "The AED will re-analyze every 2 minutes. Continue to follow its instructions until help arrives." }
    ],
    mistakes: ["Forgetting to wipe a wet chest dry before applying pads", "Touching the person during analysis or shock", "Delaying the start of CPR after a shock"],
    success_criteria: "You can operate an AED with confidence by following its clear voice prompts."
  }
};