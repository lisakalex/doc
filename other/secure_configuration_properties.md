
# Secure Configuration Properties

You can encrypt configuration properties as another security level for your applications. To create secure configuration properties, review the following process:

1. Create a secure configuration properties file.
2. Define secure properties in the file by enclosing the encrypted values between the sequence `![value]`.
3. Configure the file in the project with the Mule Secure Configuration Properties Extension module. The file must point to or include the decryption key.

## Secure Configuration Properties Attributes

### Table 1. Secure Configuration Properties Attributes

| Attribute Name       | Description |
|----------------------|-------------|
| **Name**             | A unique name for your global secure configuration properties. |
| **Key**              | A word or phrase that you specify to unlock the properties value. For example, `${production.myproperty}` instructs the Mule runtime engine to demand the key at runtime. |
| **File**             | The location of the file that the key unlocks. |
| **Encoding**         | Encoding of the file that the key unlocks. The default value is UTF-8. |
| **File Level Encryption** | Set to true if the file itself is entirely encrypted. Default value is false. |

### Table 2. Secure Configuration Properties Encrypting Attributes

| Attribute Name       | Description |
|----------------------|-------------|
| **Algorithm**        | The type of algorithm you use to encrypt the content of the property. |
| **Mode**             | The procedure that allows the Mule runtime engine to repeatedly use a block cipher with a single key. |
| **Use random IVs**   | Set this attribute to true to use random initialization vectors (IVs). |

## Create a Secure Configuration Properties File

Create a `.yaml` or `.properties` file in `src/main/resources` or using absolute paths.

## Define Secure Configuration Properties in the File

Example `file1.yaml`:

```yaml
encrypted:
  value1: "![nHWo5JhNAYM+TzxqeHdRDXx15Q5R56YVGiQgXCoBCew=]"
  value2: "![nHWo6XyCADP+TzxqeHdRDXx15Q5R56YVGiQgXCoDFaj=]"

testPropertyA: "testValueA"
testPropertyB: "testValueB"
```

Example `file1.properties`:

```properties
encrypted.value1=![nHWo5JhNAYM+TzxqeHdRDXx15Q5R56YVGiQgXCoBCew=]
encrypted.value2=![nHWo6XyCADP+TzxqeHdRDXx15Q5R56YVGiQgXCoDFaj=]

testPropertyA=testValueA
testPropertyB=testValueB
```

## Encrypt Properties Using the Secure Properties Tool

Tool: `secure-properties-tool.jar` (latest release: 11/22/2024, supports Java 17).

### Encrypt Text Strings

```bash
java -cp secure-properties-tool.jar com.mulesoft.tools.SecurePropertiesTool \
string \
encrypt \
Blowfish \
CBC \
mulesoft \
"some value to encrypt"
```

Output:
```
8q5e1+jy0cND2iV2WPThahmz6XsDwB6Z
```

### Encrypt Properties Inside a File

```bash
java -cp secure-properties-tool.jar com.mulesoft.tools.SecurePropertiesTool \
file \
encrypt \
Blowfish \
CBC \
mulesoft \
example_in.yaml \
example_out.yaml
```

### Encrypt All the Content of a File

```bash
java -cp secure-properties-tool.jar com.mulesoft.tools.SecurePropertiesTool \
file-level \
encrypt \
Blowfish \
CBC \
mulesoft \
example_in.yaml \
example_out.yaml
```

## Parameters Reference

| Parameter        | Description |
|------------------|-------------|
| `<method>`       | Accepted: `string`, `file`, `file-level` |
| `<operation>`    | Accepted: `encrypt`, `decrypt` |
| `<algorithm>`    | The encryption algorithm |
| `<mode>`         | The mode for the algorithm |
| `<key>`          | The encryption/decryption key |
| `<value>`        | String to encrypt/decrypt |
| `<input file>`   | Input file path |
| `<output file>`  | Output file path |
| `--use-random-iv`| Optional, use random IVs |

## Configure the File in the Project

### XML Configuration

```xml
<secure-properties:config key="${runtime.property}" file="file1.yaml" name="test">
  <secure-properties:encrypt/>
</secure-properties:config>

<global-property name="prop" value="my-${secure::property.key1}"/>
```

### Custom Values

```xml
<secure-properties:config key="${runtime.property}" file="file1.properties" name="test">
  <secure-properties:encrypt algorithm="AES" mode="CBC" useRandomIVs="true"/>
</secure-properties:config>
```

## Studio Configuration

- Install the Secure Configuration Property Module from Exchange.
- Add via Mule Palette.
- Configure in Global Elements tab.

## File-Level Encryption

```xml
<secure-properties:config key="${runtime.property}" file="file1.yaml" fileLevelEncryption="true" name="test">
  <secure-properties:encrypt algorithm="AES" mode="CBC"/>
</secure-properties:config>
```

## Use Cases

### Encrypted Value

```xml
<flow name="main">
  <set-payload value="${secure::encrypted.value1}"/>
</flow>
```

### Nonencrypted Value

```xml
<flow name="mainNonEncrypted">
  <set-payload value="${secure::testPropertyA}"/>
</flow>
```

### Environment-Based File

```xml
<secure-properties:config key="${runtime.property}" file="${env}-properties.yaml" name="test"/>
```

With default value:

```xml
<global-property name="env" value="dev"/>
```

### Multiple Files

```xml
<secure-properties:config key="${runtime.property}" file="file1.yaml" name="test">
  <secure-properties:encrypt algorithm="AES" mode="CBC"/>
</secure-properties:config>

<secure-properties:config key="${runtime.property}" file="file2.yaml" name="otherConfig">
  <secure-properties:encrypt algorithm="AES" mode="CBC"/>
</secure-properties:config>
```

## Supported Configuration File Types

- `.properties` (Spring-formatted)
- `.yaml`

## Supported Algorithms

- AES (default)
- Blowfish
- DES
- DESede
- RC2
- RCA
- Others with JCE Provider: Camellia, CAST5/6, Noekeon, Rijndael, SEED, Serpent, Skipjack, TEA, Twofish, XTEA, RC5/6

## Supported Modes

- CBC (default)
- CFB
- ECB
- OFB
