'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Wrench, CheckCircle2, X } from 'lucide-react';
import FaultF066 from '@/components/fault-f066';
import FaultF055 from '@/components/fault-f055';
import FaultF252 from '@/components/fault-f252';

interface ErrorCode {
  code: string;
  title: string;
  description: string;
  causes: string[];
  solutions: string[];
  image?: string;
}

const errorCodes: ErrorCode[] = [
  {
    code: "F066",
    title: "Fault F66",
    description: "The tumble dryer has switched off. This fault code can have several causes.",
    causes: [
      "The fluff filters are soiled.",
      "The plinth filter in front of the heat exchanger is soiled.",
      "The tumble dryer has been overloaded by placing too much laundry inside.",
      "The ventilation grille under the door is obstructed.",
      "Ventilation to and from the appliance is insufficient (e.g. because it is installed in a small room). This may have caused the room temperature to rise sharply.",
      "The plinth filter is encrusted (see Fig.4).",
      "The plinth filter is damaged or out of shape (see Fig.5)."
    ],
    solutions: [
      "Environmental impact due to fluff which has been disposed of incorrectly. To prevent microplastics from spreading into the waste water system, fluff must not be drained away with the water. Dispose of the fluff collected by the fluff filters with your household waste.",
      "Tip: You can also use a vacuum cleaner so that you can remove the fluff without touching it.",
      "Clean the fluff filters as follows:",
      "1. Open the door.",
      "2. Pull the upper fluff filter forwards to remove it.",
      "3. Remove the fluff from the surface of all the fluff filters and the perforated laundry deflector.",
      "4. Turn the yellow rotary control on the lower fluff filter in the direction of the arrow (until you hear it click). Hold the rotary control and pull the fluff filter forwards to remove it.",
      "5. Use a vacuum cleaner with a long crevice nozzle attached to remove any visible fluff from the upper air flow openings.",
      "6. Clean all fluff filters with water:",
      "   - Wipe the smooth plastic surfaces with a damp cloth.",
      "   - Rinse the filter surfaces under warm running water.",
      "   - Shake thoroughly and dry carefully.",
      "7. Wet fluff filters could cause operational faults while drying. Push the lower fluff filter in completely and lock it with the yellow rotary control. Push the upper fluff filter all the way in. Close the door.",
      "For plinth filter:",
      "1. Press the round, indented area on the heat exchanger access panel to open it.",
      "2. Pull the plinth filter out by the handle.",
      "3. Clean carefully under running water.",
      "4. To speed up removal of residue, run a water jet vertically over the front of the plinth filter. Squeeze very carefully several times as you rinse it.",
      "5. The plinth filter must not be fitted dripping wet. Otherwise, this could cause a fault. Carefully squeeze the water out of the plinth filter.",
      "Risk of injury from sharp cooling fins. You could cut yourself. Do not touch the cooling fins with your hands. Use a vacuum cleaner with a dusting brush attached.",
      "For overloading: Take out some of the laundry. Start the process again.",
      "Remove objects that are obstructing the ventilation grille under the door.",
      "For insufficient ventilation: When drying, open a door or window to ensure sufficient ventilation.",
      "For encrusted plinth filter: Wash separately in the washing machine without detergent at max. 40 °C with a spin speed of max. 600 rpm.",
      "For damaged plinth filter: Replace the plinth filter. You can order a plinth filter from the Miele online shop."
    ]
  },
  {
    code: "F252",
    title: "Door Contact Issue",
    description: "The door contacts in the area of the door hinge are dirty.",
    causes: [
      "Dirty door contacts in hinge area",
      "Contamination in the door hinge area"
    ],
    solutions: [
      "Clean the door contacts thoroughly",
      "Ensure the door hinge area is free from debris",
      "Contact Miele Customer Service if the issue persists"
    ]
  },
  {
    code: "F055",
    title: "Maximum Drying Time Exceeded", 
    description: "The laundry is still not dry after the maximum drying time of 180 minutes. Only with residual moisture drying programme.",
    causes: [
      "The drum is too full",
      "The laundry is too damp",
      "The fluff filters are soiled",
      "The laundry has not been spun sufficiently"
    ],
    solutions: [
      "Do not exceed the maximum load size for the drying programme selected",
      "Spin the laundry at a higher speed in the washing machine",
      "Clean the fluff filters thoroughly following the provided steps",
      "Ensure laundry is spun at the highest possible speed in the washing machine"
    ]
  },
  {
    code: "F020",
    title: "Heating system fault",
    description: "The heating system is not functioning correctly.",
    causes: [
      "Faulty heating element",
      "Overheating protection activated",
      "Electrical connection problem",
      "Control board malfunction"
    ],
    solutions: [
      "Allow appliance to cool down completely",
      "Check electrical connections",
      "Contact service technician for heating element inspection",
      "Professional diagnosis of control systems required"
    ]
  }
];

interface ErrorsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  buildingName: string;
}

export default function ErrorsDialog({ isOpen, onClose, buildingName }: ErrorsDialogProps) {
  const [selectedError, setSelectedError] = useState(errorCodes[0]?.code || '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Error Codes - {buildingName}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Tabs value={selectedError} onValueChange={setSelectedError} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {errorCodes.map((error) => (
              <TabsTrigger 
                key={error.code} 
                value={error.code}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4 text-red-500" />
                {error.code}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {errorCodes.map((error) => (
            <TabsContent key={error.code} value={error.code}>
              {error.code === 'F066' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Error {error.code}: {error.title}
                    </CardTitle>
                    <CardDescription>{error.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FaultF066 />
                  </CardContent>
                </Card>
              ) : error.code === 'F055' || error.code === 'F252' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Error {error.code}: {error.title}
                    </CardTitle>
                    <CardDescription>{error.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error.code === 'F055' ? <FaultF055 /> : <FaultF252 />}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Error {error.code}: {error.title}
                    </CardTitle>
                    <CardDescription>{error.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Standard single image placeholder for other error codes */}
                    <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Image</span>
                        </div>
                        <p className="text-gray-500 text-sm">Diagnostic Image</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Causes */}
                      <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          Possible Causes
                        </h4>
                        <ul className="space-y-2">
                          {error.causes.map((cause, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{cause}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Solutions */}
                      <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-blue-500" />
                          How to fix it?
                        </h4>
                        <ul className="space-y-2">
                          {error.solutions.map((solution, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-yellow-800">Important Notice</h5>
                          <p className="text-sm text-yellow-700 mt-1">
                            If the problem persists after trying these solutions, please contact the building maintenance team or call a professional service technician.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
