#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// MousePixelCoordinates.glsl

// Instructions: Click and Drag mouse button

// ------- GLSL Smaller Number Printing - @P_Malin -----------------
// Creative Commons CC0 1.0 Universal (CC-0)
// Feel free to modify, distribute or use in commercial code, just don't hold me liable for anything bad that happens!
// If you use this code and want to give credit, that would be nice but you don't have to.
// I first made this number printing code in https://www.shadertoy.com/view/4sf3RN
// A stripped version you can find at https://www.shadertoy.com/view/4sBSWW
// Note that the values printed are not always accurate!

vec2 vFontSize = vec2(8.0, 15.0);	// Multiples of 4x5 work best

//---------------------------------------
float DigitBin(const in int x)
{
    return x==0 ? 480599.0
         : x==1 ? 139810.0
         : x==2 ? 476951.0
         : x==3 ? 476999.0
         : x==4 ? 350020.0
         : x==5 ? 464711.0
         : x==6 ? 464727.0
         : x==7 ? 476228.0
         : x==8 ? 481111.0
         : x==9 ? 481095.0
         :             0.0;
}
//---------------------------------------
float PrintValue(const in vec2 fragCoord, 
                 const in vec2 vPixelCoords, 
                 const in float fValue, 
                 const in float fMaxDigits, 
                 const in float fDecimalPlaces)
{
    vec2 vStringCharCoords = (fragCoord.xy - vPixelCoords) / vFontSize;
    if ((vStringCharCoords.y < 0.0) || (vStringCharCoords.y >= 1.0)) return 0.0;
	float fLog10Value = log2(abs(fValue)) / log2(10.0);
	float fBiggestIndex = max(floor(fLog10Value), 0.0);
	float fDigitIndex = fMaxDigits - floor(vStringCharCoords.x);
	float fCharBin = 0.0;
	if(fDigitIndex > (-fDecimalPlaces - 1.01)) {
		if(fDigitIndex > fBiggestIndex) {
			if((fValue < 0.0) && (fDigitIndex < (fBiggestIndex+1.5))) fCharBin = 1792.0;
		} else {		
			if(fDigitIndex == -1.) {
				if(fDecimalPlaces > 0.) fCharBin = 2.;
			} else {
				if(fDigitIndex < 0.) fDigitIndex += 1.;
				float fDigitValue = (abs(fValue / (pow(10.0, fDigitIndex))));
                float kFix = 0.0001;
                fCharBin = DigitBin(int(floor(mod(kFix+fDigitValue, 10.0))));
			}		
		}
	}
    return floor(mod((fCharBin / pow(2.0, floor(fract(vStringCharCoords.x) * 4.0) 
                                       + (floor(vStringCharCoords.y * 5.0) * 4.0))), 2.0));
}
//----------------------------------------------------------------

const vec3 backColor = vec3(0.15, 0.10, 0.10);
      vec3 dotColor  = vec3(0.80, 0.80, 0.00);
const vec3 mxColor   = vec3(1.00, 0.00, 0.00);
const vec3 myColor   = vec3(0.00, 1.00, 0.00);

      vec3 vColor    = backColor;

      vec2 mousePos = vec2(0.0);    // mouse pixel coordinates

//----------------------------------------------------------------
void printMousePos(vec2 pos)
{
  int digits = 3;
  float radius = 3.0;
  float value = mousePos.x;

  // print dot 
  float fDistToPointB = length(mousePos - pos) - radius;
  vColor = mix(backColor, dotColor, (1.0 - clamp(fDistToPointB, 0.0, 1.0)));

  // print mouse.x
  vec2 vPixelCoord = mousePos + vec2(-28.0, radius + 2.0);
  if (mousePos.y > (resolution.y - 2.0*vFontSize.y))   vPixelCoord.y -= 2.*vFontSize.y;
  if (mousePos.x < (               3.0*vFontSize.x))   digits = +4;
  if (mousePos.x > (resolution.x - 3.0*vFontSize.x))   digits = -1;
  float fDigits = float(digits);
  float vc = PrintValue(pos, vPixelCoord, value, fDigits, 0.);
  vColor = mix( vColor, mxColor, vc);
		
  // print Mouse.Y
  vPixelCoord = mousePos + vec2(0.0, radius + 2.0);
  value = mousePos.y;       //  / resolution.y;
  if (mousePos.y > (resolution.y - 2.*vFontSize.y))   vPixelCoord.y -= 2.*vFontSize.y;
  vc = PrintValue(pos, vPixelCoord, value, fDigits, 0.);
  vColor = mix( vColor, myColor, vc);
}    

//----------------------------------------------------------------
void main()
{
  mousePos = mouse.xy * resolution;	

  // print Mouse Pixel Coordinates
  printMousePos(gl_FragCoord.xy);

  gl_FragColor = vec4(vColor,1.0);
}