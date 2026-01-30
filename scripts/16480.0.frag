// (c) 2011 detunized (http://detunized.net)
// Paste the shader below into http://www.iquilezles.org/apps/shadertoy/?p=deform
// Click and drag the mouse around
 
#ifdef GL_ES
precision highp float;
#endif
 
uniform vec2 resolution;
uniform vec4 mouse;
uniform sampler2D tex0;
 
void main(void)
{
float R = 100.0;
float h = 40.0;
float hr = R * sqrt(1.0 - ((R - h) / R) * ((R - h) / R));
 
vec2 xy = gl_FragCoord.xy - mouse.xy;
float r = sqrt(xy.x * xy.x + xy.y * xy.y);
vec2 new_xy = r < hr ? xy * (R - h) / sqrt(R * R - r * r) : xy;
gl_FragColor = texture2D(tex0, (new_xy + mouse.xy) / resolution);
}