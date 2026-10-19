package course;

import static course.Kafka.topic;

/**
 * Entry point of the lab client: one command per experiment, dispatched to the class that owns it.
 *
 * <p>Small teaching experiments, not a production client framework. All destructive preparation is
 * restricted to explicitly named lab topics. Commands never connect to an external cluster unless
 * BOOTSTRAP_SERVERS is changed.
 *
 * <p>Where to read each experiment: {@link Topics} (prepare, describe, offsets, expand), {@link
 * Producing} (seed, put, benchmark, duplicate, compact-seed, skew, window-seed), {@link Consuming}
 * (read, consume, watch, reset, lag, table, dedup), {@link Transactions} (delivery, transactions,
 * eos, verify), {@link Integrations} (schema, connect-status, outbox, streams, windows), {@link
 * Security} (acl) and {@link Clusters} (mirror, share). {@link Visor} serves the live viewer.
 */
public final class Lab {
  private Lab() {}

  private static int number(String[] a) {
    return Integer.parseInt(a[1]);
  }

  private static String arg(String[] a, int i, String fallback) {
    return a.length > i ? a[i] : fallback;
  }

  private static void help() {
    System.out.println(
        "Kafka course lab / Laboratorio Kafka\n"
            + "Commands: cluster, prepare N, seed N, describe N, read N [read_committed],"
            + " read-topic NAME [isolation], put N KEY VALUE, offsets N, expand N COUNT,"
            + " consume N GROUP, watch N GROUP, reset N GROUP, lag N GROUP, describe-group GROUP,"
            + " benchmark N LINGER BATCH, compact-seed N, table N, delivery crash|resume,"
            + " duplicate N, dedup N, transactions N, eos N [abort], verify 27,"
            + " schema compatible|incompatible, connect-status, outbox create|crash|relay,"
            + " streams 20, windows 21, window-seed 21, acl setup|writer|reader, skew N, mirror,"
            + " share, visor.\n"
            + "Run prepare only after stopping this lesson's consumers. It resets only that"
            + " lesson's topics.");
  }

  public static void main(String[] args) {
    try {
      String cmd = arg(args, 0, "help");
      switch (cmd) {
        case "help" -> help();
        case "cluster" -> Topics.cluster();
        case "prepare" -> Topics.prepare(number(args));
        case "seed" -> Producing.seed(number(args));
        case "describe" -> Topics.describe(number(args));
        case "read" ->
            Consuming.readAndPrint(topic(number(args)), arg(args, 2, "read_uncommitted"));
        case "read-topic" -> Consuming.readAndPrint(args[1], arg(args, 2, "read_uncommitted"));
        case "put" -> Producing.put(number(args), args[2], args[3]);
        case "offsets" -> Consuming.offsets(number(args));
        case "expand" -> Topics.expand(number(args), Integer.parseInt(args[2]));
        case "consume" -> Consuming.consume(number(args), args[2]);
        case "watch" -> Consuming.watch(number(args), args[2]);
        case "reset" -> Consuming.reset(number(args), args[2]);
        case "lag" -> Consuming.lag(number(args), args[2]);
        case "describe-group" -> Consuming.describeGroup(args[1]);
        case "benchmark" ->
            Producing.benchmark(number(args), Integer.parseInt(args[2]), Integer.parseInt(args[3]));
        case "compact-seed" -> Producing.compactSeed(number(args));
        case "table" -> Consuming.table(number(args));
        case "delivery" -> Transactions.delivery(args[1].equals("crash"));
        case "duplicate" -> Producing.duplicate(number(args));
        case "dedup" -> Consuming.dedup(number(args));
        case "transactions" -> Transactions.transactions(number(args));
        case "eos" -> Transactions.eos(number(args), arg(args, 2, "").equals("abort"));
        case "verify" -> Transactions.verify(number(args));
        case "schema" -> Integrations.schema(args[1].equals("compatible"));
        case "connect-status" -> Integrations.connectStatus();
        case "outbox" -> Integrations.outbox(args[1]);
        case "streams" -> Integrations.streams(number(args), false);
        case "windows" -> Integrations.streams(number(args), true);
        case "window-seed" -> Producing.windowSeed(number(args));
        case "acl" -> Security.acl(args[1]);
        case "skew" -> Producing.skew(number(args));
        case "mirror" -> Clusters.mirror();
        case "share" -> Clusters.share();
        case "create-extra" -> Topics.createExtra(number(args));
        case "visor" -> Visor.run();
        default -> throw new IllegalArgumentException("Unknown command: " + cmd);
      }
    } catch (Exception ex) {
      System.err.println("LAB ERROR / ERROR DEL LAB: " + ex);
      if (ex.getCause() != null) {
        System.err.println("CAUSE: " + ex.getCause());
      }
      System.exit(1);
    }
  }
}
