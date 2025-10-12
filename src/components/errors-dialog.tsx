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
    description: "Fault F66 is shown on the tumble dryer display.",
    causes: [
      "The fluff filters are soiled",
      "The plinth filter in front of the heat exchanger is soiled",
      "The tumble dryer has been overloaded by placing too much laundry inside",
      "The ventilation grille under the door is obstructed",
      "Ventilation to and from the appliance is insufficient (e.g. because it is installed in a small room). This may have caused the room temperature to rise sharply",
      "The plinth filter is encrusted",
      "The plinth filter is damaged or out of shape"
    ],
    solutions: [
      "Environmental impact due to fluff which has been disposed of incorrectly. To prevent microplastics from spreading into the waste water system, fluff must not be drained away with the water. Dispose of the fluff collected by the fluff filters with your household waste.",
      "Tip: You can also use a vacuum cleaner so that you can remove the fluff without touching it.",
      "Clean the fluff filters as follows: 1) Open the door. 2) Pull the upper fluff filter forwards to remove it. 3) Remove the fluff from the surface of all the fluff filters and the perforated laundry deflector.",
      "Turn the yellow rotary control on the lower fluff filter in the direction of the arrow (until you hear it click). Hold the rotary control and pull the fluff filter forwards to remove it.",
      "Use a vacuum cleaner with a long crevice nozzle attached to remove any visible fluff from the upper air flow openings.",
      "Clean all fluff filters with water: Wipe the smooth plastic surfaces with a damp cloth. Rinse the filter surfaces under warm running water. Shake thoroughly and dry carefully.",
      "Wet fluff filters could cause operational faults while drying. Push the lower fluff filter in completely and lock it with the yellow rotary control. Push the upper fluff filter all the way in. Close the door.",
      "For plinth filter: Press the round, indented area on the heat exchanger access panel to open it. Pull the plinth filter out by the handle. Clean carefully under running water.",
      "To speed up removal of residue, run a water jet vertically over the front of the plinth filter. Squeeze very carefully several times as you rinse it.",
      "The plinth filter must not be fitted dripping wet. Otherwise, this could cause a fault. Carefully squeeze the water out of the plinth filter.",
      "Risk of injury from sharp cooling fins. You could cut yourself. Do not touch the cooling fins with your hands. Use a vacuum cleaner with a dusting brush attached.",
      "For overloading: Take out some of the laundry. Start the process again.",
      "Remove objects that are obstructing the ventilation grille under the door.",
      "For insufficient ventilation: When drying, open a door or window to ensure sufficient ventilation.",
      "For encrusted plinth filter: Wash separately in the washing machine without detergent at max. 40 °C with a spin speed of max. 600 rpm.",
      "For damaged plinth filter: Replace the plinth filter. You can order a plinth filter from the Miele online shop."
    ]
  },
  {
    code: "F108",
    title: "Door lock fault",
    description: "The door is not locking properly or there is an issue with the door lock mechanism.",
    causes: [
      "Door not properly closed",
      "Foreign object blocking door closure",
      "Faulty door lock mechanism",
      "Damaged door seal",
      "Electronic control issue"
    ],
    solutions: [
      "Ensure door is firmly closed",
      "Check for items preventing door from closing completely",
      "Clean door and frame area",
      "Inspect door seal for damage",
      "Contact service if lock mechanism needs replacement"
    ]
  },
  {
    code: "F055",
    title: "Temperature sensor fault", 
    description: "The temperature sensor is not working correctly, affecting the drying process.",
    causes: [
      "Faulty temperature sensor",
      "Loose sensor connections", 
      "Sensor contamination",
      "Electronic control board issue"
    ],
    solutions: [
      "Professional sensor replacement required",
      "Check sensor wiring connections",
      "Clean sensor area if accessible", 
      "Control board diagnosis may be needed"
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Error {error.code}: {error.title}
                  </CardTitle>
                  <CardDescription>{error.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Multiple Image placeholders for F066 step-by-step instructions */}
                  {error.code === 'F066' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-500 mb-2">Pulling the fluff filter out to the front</div>
                        <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Step 1 Image</span>
                        </div>
                      </div>
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-500 mb-2">Removing fluff from the fluff filter</div>
                        <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Step 2 Image</span>
                        </div>
                      </div>
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-500 mb-2">Yellow rotary control operation</div>
                        <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Step 3 Image</span>
                        </div>
                      </div>
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-500 mb-2">Opening heat exchanger access panel</div>
                        <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Step 4 Image</span>
                        </div>
                      </div>
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-500 mb-2">Pulling out plinth filter by handle</div>
                        <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Step 5 Image</span>
                        </div>
                      </div>
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray-500 mb-2">Cleaning with water jet</div>
                        <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Step 6 Image</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Special Fig. 4 and Fig. 5 placeholders for F066 */}
                  {error.code === 'F066' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg p-4 text-center">
                        <div className="text-sm font-medium text-yellow-800 mb-2">Fig. 4</div>
                        <div className="w-full h-32 bg-yellow-100 rounded flex items-center justify-center">
                          <span className="text-yellow-600 text-xs">Encrusted plinth filter example</span>
                        </div>
                        <div className="text-xs text-yellow-700 mt-2">White encrustations on edges and front</div>
                      </div>
                      <div className="bg-red-50 border-2 border-dashed border-red-300 rounded-lg p-4 text-center">
                        <div className="text-sm font-medium text-red-800 mb-2">Fig. 5</div>
                        <div className="w-full h-32 bg-red-100 rounded flex items-center justify-center">
                          <span className="text-red-600 text-xs">Damaged/deformed plinth filter</span>
                        </div>
                        <div className="text-xs text-red-700 mt-2">Torn or deformed filter that no longer fits tightly</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Standard single image placeholder for other error codes */}
                  {error.code !== 'F066' && (
                    <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Image</span>
                        </div>
                        <p className="text-gray-500 text-sm">Diagnostic Image</p>
                      </div>
                    </div>
                  )}
                  
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
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
