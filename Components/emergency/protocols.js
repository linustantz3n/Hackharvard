export const protocols = {
  CPR_NEEDED: {
    name: "CPR (Cardiopulmonary Resuscitation)",
    signs_to_look_for: [
        "The person is completely unresponsive, even when shouted at or tapped.",
        "The person is not breathing at all, or is only making gasping sounds (agonal breathing).",
        "Absence of a pulse (if trained to check)."
    ],
    steps: [
      "Ensure the scene is safe for you and the person.",
      "Check for a response. Tap their shoulder firmly and shout, 'Are you okay?'",
      "If there is no response, immediately tell someone to call 911 and get an AED if one is available.",
      "Open the airway by gently tilting the head back and lifting the chin.",
      "Check for breathing. Listen for breath sounds for no more than 10 seconds.",
      "If they are not breathing, begin chest compressions. Place the heel of one hand on the center of the chest, and the other hand on top.",
      "Push hard and fast, at least 2 inches deep, at a rate of 100 to 120 compressions per minute. Let the chest fully recoil between pushes.",
      "After 30 compressions, give 2 rescue breaths if you are trained and willing.",
      "Continue the cycle of 30 compressions and 2 breaths until help arrives, an AED is ready, or the person shows signs of life."
    ]
  },
  SEVERE_BLEEDING: {
    name: "Severe Bleeding Control",
    signs_to_look_for: [
        "Blood that is spurting from a wound.",
        "Bleeding that won't stop after applying firm pressure for several minutes.",
        "Blood that is soaking through bandages one after another.",
        "Signs of shock, such as pale/clammy skin, confusion, weakness, or rapid breathing."
    ],
    steps: [
      "Your safety is first. If possible, put on gloves and have the person lie down.",
      "Find the source of the bleeding. Remove any clothing or debris from the wound.",
      "Apply firm, direct pressure on the wound using a clean cloth, bandage, or your hands.",
      "Maintain continuous pressure. Do not stop to check the wound.",
      "If blood soaks through the material, do not remove it. Add more cloth or bandages on top and continue pressing firmly.",
      "If the wound is on a limb, elevate it above the level of the heart while still applying pressure.",
      "If direct pressure doesn't stop the bleeding, apply pressure to a pressure point (brachial artery in the arm, or femoral artery in the groin).",
      "Keep the person warm and comfortable until medical help arrives."
    ]
  },
  CHOKING: {
    name: "Choking First Aid (Conscious Adult)",
    signs_to_look_for: [
        "The person cannot speak, cough, or cry.",
        "The person is clutching their throat with one or both hands (the universal sign for choking).",
        "Their face, lips, or fingernails may be turning blue or dusky.",
        "Wheezing or high-pitched noises when trying to breathe."
    ],
    steps: [
      "First, ask 'Are you choking? Can you speak?' If they can cough or speak, encourage them to keep coughing.",
      "If the person cannot breathe, cough, or speak, stand behind them and lean them forward slightly.",
      "Give 5 firm back blows between their shoulder blades with the heel of your hand.",
      "Check if the blockage has cleared. If not, proceed to abdominal thrusts.",
      "Stand behind the person and wrap your arms around their waist.",
      "Make a fist with one hand. Place it just above their navel (belly button).",
      "Grasp your fist with your other hand. Press hard into the abdomen with a quick, upward thrust — as if trying to lift the person up.",
      "Perform 5 abdominal thrusts.",
      "Continue alternating between 5 back blows and 5 abdominal thrusts until the object is forced out or the person becomes unresponsive."
    ]
  },
  SEIZURE: {
    name: "Seizure First Aid",
    signs_to_look_for: [
        "Uncontrolled, jerking movements of the arms, legs, or whole body.",
        "A sudden loss of consciousness or awareness.",
        "Staring into space or seeming confused.",
        "Temporary confusion, fatigue, or headache after the event."
    ],
    steps: [
      "Stay calm and guide the person gently to the floor.",
      "Clear the area of any hard or sharp objects to prevent injury.",
      "Place something soft and flat, like a folded jacket, under their head.",
      "CRITICAL: Do not hold them down or try to stop their movements.",
      "CRITICAL: Do not put anything in their mouth. This can cause injury.",
      "Time the seizure. Note when it starts and stops.",
      "After the seizure stops, gently roll the person onto their side. This helps them breathe and prevents choking on saliva.",
      "Stay with the person until they are fully awake and aware. Reassure them calmly.",
      "Call 911 if the seizure lasts longer than 5 minutes, if they have trouble breathing afterwards, if they are injured, or if it is their first seizure."
    ]
  },
  BURN: {
    name: "Burn First Aid (Minor to Moderate)",
    signs_to_look_for: [
        "Red, painful skin (1st degree).",
        "Blistering, significant pain, and swelling (2nd degree).",
        "Charred, white, or blackened skin that may be numb (3rd degree - always an emergency).",
        "The burn covers a large area of the body (larger than the person's palm)."
    ],
    steps: [
      "Immediately stop the burning process. Move the person away from the heat source.",
      "Cool the burn. Run cool (not cold) water over the burn area for 10 to 20 minutes.",
      "Gently remove any jewelry or tight clothing from the burned area before it starts to swell.",
      "Do not use ice, icy water, or any creams or greasy substances like butter.",
      "After cooling, cover the burn loosely with a sterile, non-stick bandage or a clean cloth.",
      "Do not break any blisters that form. They help protect against infection.",
      "Give an over-the-counter pain reliever like ibuprofen or acetaminophen if needed.",
      "Seek medical help for any large or deep burns, or burns on the face, hands, feet, or genitals."
    ]
  },
};