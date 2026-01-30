//By Morphix

precision mediump float;

uniform vec2 resolution;
uniform float time;

void main(){
    vec2 uv = (gl_FragCoord.xy - .5 * resolution.xy) / resolution.y;
    
    for(float i=1.; i<11.; i++){
        uv.x += .5/i*sin(1.9 * i * uv.y + time / 2. - cos(time / 66. + uv.x))+21.;
        uv.y += .4/i*cos(1.6 * i * uv.x + time / 3. + sin(time / 55. + uv.y))+31.;
    }

    gl_FragColor = vec4(sin(3. * uv.x - uv.y), sin(3. * uv.y), sin(3. * uv.x), 1);
}