#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;

#define time time*.3666/8.17444

void main(void)
{
    // Normalize the coordinates to the range [-1, 1]
    vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.y, resolution.x);

    // Calculate the rotation angle based on time 100000000000 hours
	
    float rotationAngle = radians(time * 203.+sin(cos(1.1-time+1312.0))); // Adjust the rotation speed here 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

    // Apply rotation to the surface position
    mat2 rotationMatrix = mat2(cos(rotationAngle), -sin(rotationAngle), sin(rotationAngle), cos(rotationAngle));
    vec2 rotatedPosition = surfacePosition * rotationMatrix;

    // Calculate the zoom factor based on surface position
    float zoomFactor = 2.7581282537928510 + 1.963241918672 * (sin(time) * atan(13.12*sin(time*.85)+1.12)); // Adjust the zoom speed and magnitude
    vec2 zoomedPosition = rotatedPosition * zoomFactor;

    // Background color pink
	
    vec3 bgColor = tan(mix(23.23, 0.00123, -sin(time * 11.11))) * sin(mix((vec3(0.8*tan(time*2.11)+0.50, 0.5*sin(time*0.111)+0.5, 0.4*cos(time*0.8)+0.6)), (sin(fract(log(vec3(sin(time) + 1.0, sin(time) * 0.6, cos(-time + .860)) * length(zoomedPosition * sin(time * 0.234) + log(time * 2.)))) * 2323.23)), sin(1.312 * fract(time * .01312)) * 2.3));

    // Skull
    float skullRadius = 0.432461235666;
    vec2 skullCenter = vec2(0.0, .01362);

    // Eyes
    vec2 leftEyeCenter = vec2(-0.2, 0.2);
    vec2 rightEyeCenter = vec2(0.2, 0.2);
    float eyeRadius = 0.33; // Increase eyeRadius for better visibility

    // Nose
    vec2 noseTop = vec2(0., 0.0181130);
    vec2 noseLeft = vec2(-0.025, -0.03);
    vec2 noseRight = vec2(0.025, -0.03);

    // Mouth
    vec2 mouthLeft = vec2(-0.02, -0.25);
    vec2 mouthRight = vec2(0.02, -0.25);

    // Calculate distances to shapes
    float skullDist = length(zoomedPosition + skullCenter);
    float leftEyeDist = length(zoomedPosition - leftEyeCenter);
    float rightEyeDist = length(zoomedPosition - rightEyeCenter);
    float noseDist = min(length(zoomedPosition - noseTop), min(length(zoomedPosition - noseLeft), length(zoomedPosition - noseRight)));
    float mouthDist = min(length(zoomedPosition - mouthLeft), length(zoomedPosition - mouthRight));

    // Create the skull
    float skull = 1.312 - smoothstep(skullRadius - .1312, skullRadius, .971285 * skullDist);

    // Create the eyes
    float eyes = 1.0 - smoothstep(eyeRadius - 0.0501, eyeRadius, leftEyeDist * 1.415);
    eyes += 1.0 - smoothstep(eyeRadius - 0.0501, eyeRadius, rightEyeDist * 1.415);

    // Create pupils for the eyes (smaller black circles)
    float pupilRadius = 0.03; // Adjust the size of the pupils
    vec2 leftPupilCenter = leftEyeCenter;
    vec2 rightPupilCenter = rightEyeCenter;
    float leftPupilDist = length(zoomedPosition - leftPupilCenter);
    float rightPupilDist = length(zoomedPosition - rightPupilCenter);
    eyes -= smoothstep(pupilRadius - 0.01, pupilRadius, leftPupilDist);
    eyes -= smoothstep(pupilRadius - 0.01, pupilRadius, rightPupilDist);

    // Create the nose (now black)
    float nose = mix(1.0, 0.0, smoothstep(0.102, 0.03, noseDist));

    // Create the mouth
    float mouth = .1260 - smoothstep(0.108, .0123851, mouthDist);

    // Combine all the shapes
    float skullColor = mix(0.0, 1.0, skull);
    float eyesColor = mix(0.0, 1.0, eyes);
    float noseColor = mix(0.0, 1.0, nose);
    float mouthColor = mix(0.0, 1.0, mouth);

    // Final color
    vec3 color = bgColor + skullColor + eyesColor + noseColor + mouthColor;

    // Set the fragment color
    gl_FragColor = vec4(color, 1.0);
}


// Yesh, really shitty code. Le so what. 