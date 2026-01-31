//synthétiseur vidéo simple dans un style analogique, modifier les valeurs des différents float pour voir ce qu'il peut faire!


#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 resolution;
 
// OSCILLATOR A CONTROL
uniform float OSC_A_MODULATION_FREQ;
uniform float OSC_A_MODULATION_SHAPE;
uniform float OSC_A_MODULATION_SPEED;
uniform float OSC_A_MODULATION_AMP;
uniform float OSC_A_FREQ;
uniform float OSC_A_SHAPE;
uniform float OSC_A_ROTATE;
uniform float OSC_A_SPEED;
uniform float OSC_A_R;  
uniform float OSC_A_G;
uniform float OSC_A_B;
uniform float OSC_A_DIMMER;

// OSCILLATOR B CONTROL
uniform float OSC_B_MODULATION_FREQ;
uniform float OSC_B_MODULATION_SHAPE;
uniform float OSC_B_MODULATION_SPEED;
uniform float OSC_B_MODULATION_AMP;
uniform float OSC_B_FREQ;
uniform float OSC_B_SHAPE;
uniform float OSC_B_ROTATE;
uniform float OSC_B_SPEED;
uniform float OSC_B_R;
uniform float OSC_B_G;
uniform float OSC_B_B;
uniform float OSC_B_DIMMER;

// OSCILLATOR C CONTROL
uniform float OSC_C_MODULATION_FREQ;
uniform float OSC_C_MODULATION_SHAPE;
uniform float OSC_C_MODULATION_SPEED;
uniform float OSC_C_MODULATION_AMP;
uniform float OSC_C_FREQ;
uniform float OSC_C_SHAPE;
uniform float OSC_C_ROTATE;
uniform float OSC_C_SPEED;
uniform float OSC_C_R;
uniform float OSC_C_G;
uniform float OSC_C_B;
uniform float OSC_C_DIMMER;

// OSCILLATOR D CONTROL (MULT)
uniform float OSC_D_MODULATION_FREQ;
uniform float OSC_D_MODULATION_SHAPE;
uniform float OSC_D_MODULATION_SPEED;
uniform float OSC_D_MODULATION_AMP;
uniform float OSC_D_FREQ;
uniform float OSC_D_SHAPE;
uniform float OSC_D_ROTATE;
uniform float OSC_D_SPEED;
uniform float OSC_D_DIMMER;

// OSCILLATOR E CONTROL (DIVID)
uniform float OSC_E_MODULATION_FREQ;
uniform float OSC_E_MODULATION_SHAPE;
uniform float OSC_E_MODULATION_SPEED;
uniform float OSC_E_MODULATION_AMP;
uniform  float OSC_E_FREQ;
uniform float OSC_E_SHAPE;
uniform float OSC_E_ROTATE;
uniform float OSC_E_SPEED;
uniform float OSC_E_DIMMER;


// OSCILLATOR GLOBAL
uniform float OSCILLATOR_MAIN_R;
uniform float OSCILLATOR_MAIN_G;
uniform float OSCILLATOR_MAIN_B;

uniform float OSCILLATOR_MAIN_ROTATE;
uniform float OSCILLATOR_MAIN_ZOOM; // Negatif zoom positif unzoom
uniform float OSCILLATOR_MAIN_ZOOM_X; // -1 à 1 ?? // zoom X
uniform float OSCILLATOR_MAIN_ZOOM_Y; // -1 à 1 ?? // zoom X
uniform float OSCILLATOR_MAIN_X; // (- DROITE + GAUCHE)
uniform float OSCILLATOR_MAIN_Y; // (- HAUT + BAS)
uniform float OSCILLATOR_MAIN_DEFILEMENT_X; // (- DROITE + GAUCHE)
uniform float OSCILLATOR_MAIN_DEFILEMENT_Y; // (- HAUT + BAS)
uniform float OSCILLATOR_MAIN_DIMMER;


// PI
const float PI = 3.14159265358979323846264338327950288419716939937510582;
// ROTATE
mat2 rotate(float angle){ return mat2(cos(angle), -sin(angle), sin(angle), cos(angle)); }
// ZOOM
mat2 zoom(vec2 _scale){ return mat2(_scale.x,0.0, 0.0,_scale.y);}
// ZOOM X
mat2 zoomx(vec2 _scale){ return mat2(_scale.x,0.0, 0.0,1.0);}
// ZOOM Y
mat2 zoomy(vec2 _scale){ return mat2(1.0,0.0, 0.0,_scale.y);}



//out vec4 fragColor;




void main(void)
{

// OSCILLATOR A CONTROL
 float OSC_A_MODULATION_FREQ = 10.0;
 float OSC_A_MODULATION_SHAPE = 0.0;
 float OSC_A_MODULATION_SPEED = 1.0;
 float OSC_A_MODULATION_AMP = .0;

 float OSC_A_FREQ = 30.0;
 float OSC_A_SHAPE = .0;
 float OSC_A_ROTATE = 0.0;
 float OSC_A_SPEED = 0.0;
 float OSC_A_R = 1.0;  
 float OSC_A_G = 1.0;
 float OSC_A_B = 1.0;
 float OSC_A_DIMMER = 1.0;

// OSCILLATOR B CONTROL
 float OSC_B_MODULATION_FREQ = 10.0;
 float OSC_B_MODULATION_SHAPE = .0;
 float OSC_B_MODULATION_SPEED = 1.0;
 float OSC_B_MODULATION_AMP = .0;

 float OSC_B_FREQ = 30.0;
 float OSC_B_SHAPE = .0;
 float OSC_B_ROTATE = 0.5;
 float OSC_B_SPEED = 0.0;
 float OSC_B_R = 1.0;
 float OSC_B_G = 1.0;
 float OSC_B_B = 1.0;
 float OSC_B_DIMMER = 1.0;

// OSCILLATOR C CONTROL
 float OSC_C_MODULATION_FREQ = 10.0;
 float OSC_C_MODULATION_SHAPE = 0.0;
 float OSC_C_MODULATION_SPEED = 1.0;
 float OSC_C_MODULATION_AMP = 0.0;

 float OSC_C_FREQ = 30.0;
 float OSC_C_SHAPE = 1.0;
 float OSC_C_ROTATE = 0.5;
 float OSC_C_SPEED = 0.5;
 float OSC_C_R = 1.0;
 float OSC_C_G = 1.0;
 float OSC_C_B = 1.0;
 float OSC_C_DIMMER = 1.0;

// OSCILLATOR D CONTROL (MULT)
 float OSC_D_MODULATION_FREQ = 1.0;
 float OSC_D_MODULATION_SHAPE = 0.0;
 float OSC_D_MODULATION_SPEED = 0.5;
 float OSC_D_MODULATION_AMP = 0.0;

 float OSC_D_FREQ = 30.0;
 float OSC_D_SHAPE = 3.0;
 float OSC_D_ROTATE = 0.0;
 float OSC_D_SPEED = 0.0;
 float OSC_D_DIMMER = 1.0;

// OSCILLATOR E CONTROL (DIVID)
 float OSC_E_MODULATION_FREQ = 10.0;
 float OSC_E_MODULATION_SHAPE = 2.0;
 float OSC_E_MODULATION_SPEED = 0.2;
 float OSC_E_MODULATION_AMP = 1.0;

 float OSC_E_FREQ = 30.0;
 float OSC_E_SHAPE = 3.0;
 float OSC_E_ROTATE = 0.25;
 float OSC_E_SPEED = 0.;
 float OSC_E_DIMMER = 1.0;


// OSCILLATOR GLOBAL
 float OSCILLATOR_MAIN_R = 1.0;
 float OSCILLATOR_MAIN_G = 1.0;
 float OSCILLATOR_MAIN_B = 1.0;

 float OSCILLATOR_MAIN_ROTATE = 0.0;
 float OSCILLATOR_MAIN_ZOOM = 0.0; // Negatif zoom positif unzoom
 float OSCILLATOR_MAIN_ZOOM_X = 0.0; // -1 à 1 ?? // zoom X
 float OSCILLATOR_MAIN_ZOOM_Y = 0.0; // -1 à 1 ?? // zoom X
 float OSCILLATOR_MAIN_X = 0.0; // (- DROITE + GAUCHE)
 float OSCILLATOR_MAIN_Y = 0.0; // (- HAUT + BAS)
 float OSCILLATOR_MAIN_DEFILEMENT_X = 0.0; // (- DROITE + GAUCHE)
 float OSCILLATOR_MAIN_DEFILEMENT_Y = 0.0; // (- HAUT + BAS)
 float OSCILLATOR_MAIN_DIMMER = 1.0;






// ___________________________DEPLACEMENT___________________________

vec2 coord_OSC_MAIN = gl_FragCoord.xy/resolution;

coord_OSC_MAIN.x += OSCILLATOR_MAIN_X + (time * OSCILLATOR_MAIN_DEFILEMENT_X) ; // DECALAGE ALL OSCILLATOR X
coord_OSC_MAIN.y += OSCILLATOR_MAIN_Y  + (time * OSCILLATOR_MAIN_DEFILEMENT_Y) ; // DECALAGE ALL OSCILLATOR Y

coord_OSC_MAIN -= vec2(0.5);
coord_OSC_MAIN = zoom (vec2(OSCILLATOR_MAIN_ZOOM + 1.0)) * coord_OSC_MAIN; // ZOOM (OSCILLATOR A)
coord_OSC_MAIN += vec2(0.5);

coord_OSC_MAIN -= vec2(0.5);
coord_OSC_MAIN = zoomx (vec2(OSCILLATOR_MAIN_ZOOM_X + 1.0)) * coord_OSC_MAIN; // ZOOM X Gauche droite
coord_OSC_MAIN += vec2(0.5);

coord_OSC_MAIN -= vec2(0.5);
coord_OSC_MAIN = zoomy (vec2(OSCILLATOR_MAIN_ZOOM_Y + 1.0)) * coord_OSC_MAIN; // ZOOM Y Haut bas
coord_OSC_MAIN += vec2(0.5);

coord_OSC_MAIN -= vec2(0.5);
coord_OSC_MAIN = rotate (OSCILLATOR_MAIN_ROTATE* PI) * coord_OSC_MAIN; // ROTATION
coord_OSC_MAIN += vec2(0.5);



vec2 coord_OSC_A = coord_OSC_MAIN; // COORD OSCILATOR A
coord_OSC_A -= vec2(0.5);
coord_OSC_A = rotate (OSC_A_ROTATE* PI) * coord_OSC_A; // ROTATION
coord_OSC_A += vec2(0.5);


vec2 coord_OSC_B = coord_OSC_MAIN; // CORRD OSCILLATOR B
coord_OSC_B -= vec2(0.5);
coord_OSC_B = rotate (OSC_B_ROTATE * PI) * coord_OSC_B; // ROTATION
coord_OSC_B += vec2(0.5);

 
vec2 coord_OSC_C = coord_OSC_MAIN; // CORRD OSCILLATOR C
coord_OSC_C -= vec2(0.5);
coord_OSC_C = rotate (OSC_C_ROTATE * PI) * coord_OSC_C; // ROTATION
coord_OSC_C += vec2(0.5);


vec2 coord_OSC_D = coord_OSC_MAIN; // CORRD OSCILLATOR D
coord_OSC_D -= vec2(0.5);
coord_OSC_D = rotate (OSC_D_ROTATE * PI) * coord_OSC_D; // ROTATION
coord_OSC_D += vec2(0.5);

vec2 coord_OSC_E = coord_OSC_MAIN; // CORRD OSCILLATOR D
coord_OSC_E -= vec2(0.5);
coord_OSC_E = rotate (OSC_E_ROTATE * PI) * coord_OSC_E; // ROTATION
coord_OSC_E += vec2(0.5);

   
   
   
//___________________________OSCILLATOR VIDEO___________________________

// OSCILLATOR A

// MODULATION
float OSC_A_MODULATION_SIN = sin((coord_OSC_A.y * (OSC_A_MODULATION_FREQ) +   time * OSC_A_MODULATION_SPEED));
float OSC_A_MODULATION_TRI = asin(sin(coord_OSC_A.y * OSC_A_MODULATION_FREQ + time * OSC_A_MODULATION_SPEED));
float OSC_A_MODULATION_SAW = 1.0 - fract((coord_OSC_A.y * OSC_A_MODULATION_FREQ / (2.0 * PI)) + (OSC_A_MODULATION_SPEED * time )/ (2.0 * PI)) * 2.0;
float OSC_A_MODULATION_SQR = ceil(sin(coord_OSC_A.y * OSC_A_MODULATION_FREQ + (OSC_A_MODULATION_SPEED * time)));


float OSCILLATOR_A_MODULATION = 0.0;
if      (OSC_A_MODULATION_SHAPE == 0.0) { OSCILLATOR_A_MODULATION = OSC_A_MODULATION_SIN; }
else if (OSC_A_MODULATION_SHAPE == 1.0) { OSCILLATOR_A_MODULATION = OSC_A_MODULATION_TRI; }
else if (OSC_A_MODULATION_SHAPE == 2.0) { OSCILLATOR_A_MODULATION = OSC_A_MODULATION_SAW; }
else if (OSC_A_MODULATION_SHAPE == 3.0) { OSCILLATOR_A_MODULATION = OSC_A_MODULATION_SQR; }


// WAVEFORMS
float OSC_A_SIN = sin((coord_OSC_A.x * OSC_A_FREQ + (OSCILLATOR_A_MODULATION * OSC_A_MODULATION_AMP) + time * OSC_A_SPEED)); //  sin (coord_OSC_A.y *  500.0  + time *  2.0 ) +
float OSC_A_TRI = asin(sin(coord_OSC_A.x * OSC_A_FREQ + (OSCILLATOR_A_MODULATION * OSC_A_MODULATION_AMP) + time * OSC_A_SPEED));
float OSC_A_SAW = 1.0 - fract((coord_OSC_A.x * OSC_A_FREQ / (2.0 * PI)) + (OSCILLATOR_A_MODULATION / (2.0 * PI) * OSC_A_MODULATION_AMP) + (time * OSC_A_SPEED)/ (2.0 * PI)) * 2.0;
float OSC_A_SQR = ceil(sin(coord_OSC_A.x * OSC_A_FREQ + (OSCILLATOR_A_MODULATION * OSC_A_MODULATION_AMP) + (OSC_A_SPEED * time)));


float OSCILLATOR_A = 0.0;
if      (OSC_A_SHAPE == 0.0) { OSCILLATOR_A = OSC_A_SIN; }
else if (OSC_A_SHAPE == 1.0) { OSCILLATOR_A = OSC_A_TRI; }
else if (OSC_A_SHAPE == 2.0) { OSCILLATOR_A = OSC_A_SAW; }
else if (OSC_A_SHAPE == 3.0) { OSCILLATOR_A = OSC_A_SQR; }






// OSCILLATOR B

// MODULATION
float OSC_B_MODULATION_SIN = sin((coord_OSC_B.y * (OSC_B_MODULATION_FREQ) +   time * OSC_B_MODULATION_SPEED));
float OSC_B_MODULATION_TRI = asin(sin(coord_OSC_B.y * OSC_B_MODULATION_FREQ + time * OSC_B_MODULATION_SPEED));
float OSC_B_MODULATION_SAW = 1.0 - fract((coord_OSC_B.y * OSC_B_MODULATION_FREQ / (2.0 * PI)) + (OSC_B_MODULATION_SPEED * time )/ (2.0 * PI)) * 2.0;
float OSC_B_MODULATION_SQR = ceil(sin(coord_OSC_B.y * OSC_B_MODULATION_FREQ + (OSC_B_MODULATION_SPEED * time)));


float OSCILLATOR_B_MODULATION = 0.0;
if      (OSC_B_MODULATION_SHAPE == 0.0) { OSCILLATOR_B_MODULATION = OSC_B_MODULATION_SIN; }
else if (OSC_B_MODULATION_SHAPE == 1.0) { OSCILLATOR_B_MODULATION = OSC_B_MODULATION_TRI; }
else if (OSC_B_MODULATION_SHAPE == 2.0) { OSCILLATOR_B_MODULATION = OSC_B_MODULATION_SAW; }
else if (OSC_B_MODULATION_SHAPE == 3.0) { OSCILLATOR_B_MODULATION = OSC_B_MODULATION_SQR; }


// WAVEFORMS
float OSC_B_SIN = sin((coord_OSC_B.x * OSC_B_FREQ + (OSCILLATOR_B_MODULATION * OSC_B_MODULATION_AMP) + time * OSC_B_SPEED)); //  sin (coord_OSC_B.y *  500.0  + time *  2.0 ) +
float OSC_B_TRI = asin(sin(coord_OSC_B.x * OSC_B_FREQ + (OSCILLATOR_B_MODULATION * OSC_B_MODULATION_AMP) + time * OSC_B_SPEED));
float OSC_B_SAW = 1.0 - fract((coord_OSC_B.x * OSC_B_FREQ / (2.0 * PI)) + (OSCILLATOR_B_MODULATION / (2.0 * PI) * OSC_B_MODULATION_AMP) + (time * OSC_B_SPEED)/ (2.0 * PI)) * 2.0;
float OSC_B_SQR = ceil(sin(coord_OSC_B.x * OSC_B_FREQ + (OSCILLATOR_B_MODULATION * OSC_B_MODULATION_AMP) + (OSC_B_SPEED * time)));


float OSCILLATOR_B = 0.0;
if      (OSC_B_SHAPE == 0.0) { OSCILLATOR_B = OSC_B_SIN; }
else if (OSC_B_SHAPE == 1.0) { OSCILLATOR_B = OSC_B_TRI; }
else if (OSC_B_SHAPE == 2.0) { OSCILLATOR_B = OSC_B_SAW; }
else if (OSC_B_SHAPE == 3.0) { OSCILLATOR_B = OSC_B_SQR; }
 



// OSCILLATOR C

// MODULATION
float OSC_C_MODULATION_SIN = sin((coord_OSC_C.y * (OSC_C_MODULATION_FREQ) +   time * OSC_C_MODULATION_SPEED));
float OSC_C_MODULATION_TRI = asin(sin(coord_OSC_C.y * OSC_C_MODULATION_FREQ + time * OSC_C_MODULATION_SPEED));
float OSC_C_MODULATION_SAW = 1.0 - fract((coord_OSC_C.y * OSC_C_MODULATION_FREQ / (2.0 * PI)) + (OSC_C_MODULATION_SPEED * time )/ (2.0 * PI)) * 2.0;
float OSC_C_MODULATION_SQR = ceil(sin(coord_OSC_C.y * OSC_C_MODULATION_FREQ + (OSC_C_MODULATION_SPEED * time)));


float OSCILLATOR_C_MODULATION = 0.0;
if      (OSC_C_MODULATION_SHAPE == 0.0) { OSCILLATOR_C_MODULATION = OSC_C_MODULATION_SIN; }
else if (OSC_C_MODULATION_SHAPE == 1.0) { OSCILLATOR_C_MODULATION = OSC_C_MODULATION_TRI; }
else if (OSC_C_MODULATION_SHAPE == 2.0) { OSCILLATOR_C_MODULATION = OSC_C_MODULATION_SAW; }
else if (OSC_C_MODULATION_SHAPE == 3.0) { OSCILLATOR_C_MODULATION = OSC_C_MODULATION_SQR; }


// WAVEFORMS
float OSC_C_SIN = sin((coord_OSC_C.x * OSC_C_FREQ + (OSCILLATOR_C_MODULATION * OSC_C_MODULATION_AMP) + time * OSC_C_SPEED)); //  sin (coord_OSC_C.y *  500.0  + time *  2.0 ) +
float OSC_C_TRI = asin(sin(coord_OSC_C.x * OSC_C_FREQ + (OSCILLATOR_C_MODULATION * OSC_C_MODULATION_AMP) + time * OSC_C_SPEED));
float OSC_C_SAW = 1.0 - fract((coord_OSC_C.x * OSC_C_FREQ / (2.0 * PI)) + (OSCILLATOR_C_MODULATION / (2.0 * PI) * OSC_C_MODULATION_AMP) + (time * OSC_C_SPEED)/ (2.0 * PI)) * 2.0;
float OSC_C_SQR = ceil(sin(coord_OSC_C.x * OSC_C_FREQ + (OSCILLATOR_C_MODULATION * OSC_C_MODULATION_AMP) + (OSC_C_SPEED * time)));


float OSCILLATOR_C = 0.0;
if      (OSC_C_SHAPE == 0.0) { OSCILLATOR_C = OSC_C_SIN; }
else if (OSC_C_SHAPE == 1.0) { OSCILLATOR_C = OSC_C_TRI; }
else if (OSC_C_SHAPE == 2.0) { OSCILLATOR_C = OSC_C_SAW; }
else if (OSC_C_SHAPE == 3.0) { OSCILLATOR_C = OSC_C_SQR; }




// OSCILLATOR D

// MODULATION
float OSC_D_MODULATION_SIN = sin((coord_OSC_D.y * (OSC_D_MODULATION_FREQ) +   time * OSC_D_MODULATION_SPEED));
float OSC_D_MODULATION_TRI = asin(sin(coord_OSC_D.y * OSC_D_MODULATION_FREQ + time * OSC_D_MODULATION_SPEED));
float OSC_D_MODULATION_SAW = 1.0 - fract((coord_OSC_D.y * OSC_D_MODULATION_FREQ / (2.0 * PI)) + (OSC_D_MODULATION_SPEED * time )/ (2.0 * PI)) * 2.0;
float OSC_D_MODULATION_SQR = ceil(sin(coord_OSC_D.y * OSC_D_MODULATION_FREQ + (OSC_D_MODULATION_SPEED * time)));


float OSCILLATOR_D_MODULATION = 0.0;
if      (OSC_D_MODULATION_SHAPE == 0.0) { OSCILLATOR_D_MODULATION = OSC_D_MODULATION_SIN; }
else if (OSC_D_MODULATION_SHAPE == 1.0) { OSCILLATOR_D_MODULATION = OSC_D_MODULATION_TRI; }
else if (OSC_D_MODULATION_SHAPE == 2.0) { OSCILLATOR_D_MODULATION = OSC_D_MODULATION_SAW; }
else if (OSC_D_MODULATION_SHAPE == 3.0) { OSCILLATOR_D_MODULATION = OSC_D_MODULATION_SQR; }


// WAVEFORMS
float OSC_D_SIN = sin((coord_OSC_D.x * OSC_D_FREQ + (OSCILLATOR_D_MODULATION * OSC_D_MODULATION_AMP) + time * OSC_D_SPEED)); //  sin (coord_OSC_D.y *  500.0  + time *  2.0 ) +
float OSC_D_TRI = asin(sin(coord_OSC_D.x * OSC_D_FREQ + (OSCILLATOR_D_MODULATION * OSC_D_MODULATION_AMP) + time * OSC_D_SPEED));
float OSC_D_SAW = 1.0 - fract((coord_OSC_D.x * OSC_D_FREQ / (2.0 * PI)) + (OSCILLATOR_D_MODULATION / (2.0 * PI) * OSC_D_MODULATION_AMP) + (time * OSC_D_SPEED)/ (2.0 * PI)) * 2.0;
float OSC_D_SQR = ceil(sin(coord_OSC_D.x * OSC_D_FREQ + (OSCILLATOR_D_MODULATION * OSC_D_MODULATION_AMP) + (OSC_D_SPEED * time)));


float OSCILLATOR_D = 0.0;
if      (OSC_D_SHAPE == 0.0) { OSCILLATOR_D = OSC_D_SIN; }
else if (OSC_D_SHAPE == 1.0) { OSCILLATOR_D = OSC_D_TRI; }
else if (OSC_D_SHAPE == 2.0) { OSCILLATOR_D = OSC_D_SAW; }
else if (OSC_D_SHAPE == 3.0) { OSCILLATOR_D = OSC_D_SQR; }




// OSCILLATOR E

// MODULATION
float OSC_E_MODULATION_SIN = sin((coord_OSC_E.y * (OSC_E_MODULATION_FREQ) +   time * OSC_E_MODULATION_SPEED));
float OSC_E_MODULATION_TRI = asin(sin(coord_OSC_E.y * OSC_E_MODULATION_FREQ + time * OSC_E_MODULATION_SPEED));
float OSC_E_MODULATION_SAW = 1.0 - fract((coord_OSC_E.y * OSC_E_MODULATION_FREQ / (2.0 * PI)) + (OSC_E_MODULATION_SPEED * time )/ (2.0 * PI)) * 2.0;
float OSC_E_MODULATION_SQR = ceil(sin(coord_OSC_E.y * OSC_E_MODULATION_FREQ + (OSC_E_MODULATION_SPEED * time)));


float OSCILLATOR_E_MODULATION = 0.0;
if      (OSC_E_MODULATION_SHAPE == 0.0) { OSCILLATOR_E_MODULATION = OSC_E_MODULATION_SIN; }
else if (OSC_E_MODULATION_SHAPE == 1.0) { OSCILLATOR_E_MODULATION = OSC_E_MODULATION_TRI; }
else if (OSC_E_MODULATION_SHAPE == 2.0) { OSCILLATOR_E_MODULATION = OSC_E_MODULATION_SAW; }
else if (OSC_E_MODULATION_SHAPE == 3.0) { OSCILLATOR_E_MODULATION = OSC_E_MODULATION_SQR; }


// WAVEFORMS
float OSC_E_SIN = sin((coord_OSC_E.x * OSC_E_FREQ + (OSCILLATOR_E_MODULATION * OSC_E_MODULATION_AMP) + time * OSC_E_SPEED)); //  sin (coord_OSC_E.y *  500.0  + time *  2.0 ) +
float OSC_E_TRI = asin(sin(coord_OSC_E.x * OSC_E_FREQ + (OSCILLATOR_E_MODULATION * OSC_E_MODULATION_AMP) + time * OSC_E_SPEED));
float OSC_E_SAW = 1.0 - fract((coord_OSC_E.x * OSC_E_FREQ / (2.0 * PI)) + (OSCILLATOR_E_MODULATION / (2.0 * PI) * OSC_E_MODULATION_AMP) + (time * OSC_E_SPEED)/ (2.0 * PI)) * 2.0;
float OSC_E_SQR = ceil(sin(coord_OSC_E.x * OSC_E_FREQ + (OSCILLATOR_E_MODULATION * OSC_E_MODULATION_AMP) + (OSC_E_SPEED * time)));


float OSCILLATOR_E = 0.0;
if      (OSC_E_SHAPE == 0.0) { OSCILLATOR_E = OSC_E_SIN; }
else if (OSC_E_SHAPE == 1.0) { OSCILLATOR_E = OSC_E_TRI; }
else if (OSC_E_SHAPE == 2.0) { OSCILLATOR_E = OSC_E_SAW; }
else if (OSC_E_SHAPE == 3.0) { OSCILLATOR_E = OSC_E_SQR; }
 
 
 
 
 // MAIN OSCILLATOR SOMMATION

vec3 OSCILLATOR = vec3(0.0, 0.0, 0.0);

OSCILLATOR.r = (((OSCILLATOR_A * OSC_A_R) * OSC_A_DIMMER) + ((OSCILLATOR_B * OSC_B_R) * OSC_B_DIMMER) + ((OSCILLATOR_C * OSC_C_R) * OSC_C_DIMMER));
OSCILLATOR.g = (((OSCILLATOR_A * OSC_A_G) * OSC_A_DIMMER) + ((OSCILLATOR_B * OSC_B_G) * OSC_B_DIMMER) + ((OSCILLATOR_C * OSC_C_G) * OSC_C_DIMMER));
OSCILLATOR.b = (((OSCILLATOR_A * OSC_A_B) * OSC_A_DIMMER) + ((OSCILLATOR_B * OSC_B_B) * OSC_B_DIMMER) + ((OSCILLATOR_C * OSC_C_B) * OSC_C_DIMMER));

OSCILLATOR = mix(OSCILLATOR, (OSCILLATOR * OSCILLATOR_D), OSC_D_DIMMER);
OSCILLATOR = mix(OSCILLATOR, (OSCILLATOR / OSCILLATOR_E), OSC_E_DIMMER);

OSCILLATOR = clamp(OSCILLATOR, 0.0, 1.0);

OSCILLATOR.r *= OSCILLATOR_MAIN_R;
OSCILLATOR.g *= OSCILLATOR_MAIN_G;
OSCILLATOR.b *= OSCILLATOR_MAIN_B;

OSCILLATOR.rgb *= OSCILLATOR_MAIN_DIMMER;



vec4 test = vec4(0.0, 0.0, 0.0, 1.0);

// ZONE DE TEST


   




test = vec4 (OSCILLATOR.rgb, 1.0) ;  


   
gl_FragColor = test;

}
