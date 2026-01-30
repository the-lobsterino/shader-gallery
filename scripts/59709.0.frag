// Real-Time Pink Flow using the famous rendering technique 'utter fucking shat' by nvidia.
// optimized with a open ended anal vector system as demonstrated at SIGGRAPH 2011 by AllYourBase.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) 
{
	vec2 anal = (gl_FragCoord.xy / resolution.xy);	// open ended anal vector
	float vv = anal.y*anal.y;
	vv+=sin(time+anal.x*3.14);
	float v = sin(sin(anal.x*2.0)*4.0+(vv) *20.0 + time * 2.0);
	v = 0.1/1.0-v;
	gl_FragColor = vec4( v*1.25, 0.02+.5*v, v, 1.0 );
}